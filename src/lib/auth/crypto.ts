import crypto from "crypto";
const key=()=>{const raw=process.env.TOTP_ENCRYPTION_KEY;if(!raw)throw new Error("TOTP_ENCRYPTION_KEY is required");return crypto.createHash("sha256").update(raw).digest();};
export const sha256=(v:string)=>crypto.createHash("sha256").update(v).digest("hex");
export const randomToken=()=>crypto.randomBytes(32).toString("base64url");
export function encrypt(plain:string){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv("aes-256-gcm",key(),iv),ciphertext=Buffer.concat([cipher.update(plain,"utf8"),cipher.final()]),tag=cipher.getAuthTag();return [iv,tag,ciphertext].map(x=>x.toString("base64url")).join(".");}
export function decrypt(payload:string){const [i,t,c]=payload.split(".");const decipher=crypto.createDecipheriv("aes-256-gcm",key(),Buffer.from(i,"base64url"));decipher.setAuthTag(Buffer.from(t,"base64url"));return Buffer.concat([decipher.update(Buffer.from(c,"base64url")),decipher.final()]).toString("utf8");}
