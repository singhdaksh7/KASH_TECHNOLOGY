import crypto from "crypto";
const key=()=>{const raw=process.env.TOTP_ENCRYPTION_KEY;if(!raw)throw new Error("TOTP_ENCRYPTION_KEY is required");return crypto.createHash("sha256").update(raw).digest();};
export const sha256=(v:string)=>crypto.createHash("sha256").update(v).digest("hex");
export const randomToken=()=>crypto.randomBytes(32).toString("base64url");
export function encrypt(plain:string){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv("aes-256-gcm",key(),iv),ciphertext=Buffer.concat([cipher.update(plain,"utf8"),cipher.final()]),tag=cipher.getAuthTag();return [iv,tag,ciphertext].map(x=>x.toString("base64url")).join(".");}
export function decrypt(payload:string){const [i,t,c]=payload.split(".");const decipher=crypto.createDecipheriv("aes-256-gcm",key(),Buffer.from(i,"base64url"));decipher.setAuthTag(Buffer.from(t,"base64url"));return Buffer.concat([decipher.update(Buffer.from(c,"base64url")),decipher.final()]).toString("utf8");}

const authSecret=()=>{const raw=process.env.AUTH_SECRET||process.env.TOTP_ENCRYPTION_KEY;if(!raw)throw new Error("AUTH_SECRET is required");return raw;};
const hmac=(v:string)=>crypto.createHmac("sha256",authSecret()).update(v).digest("base64url");
/** Short-lived signed token proving the PASSWORD step succeeded (second-factor pending). */
export function signPending(userId:string,ttlMs=5*60_000){const body=`${userId}.${Date.now()+ttlMs}`;return `${body}.${hmac(body)}`;}
export function verifyPending(token:string|undefined):string|null{if(!token)return null;const i=token.lastIndexOf(".");if(i<0)return null;const body=token.slice(0,i),sig=token.slice(i+1);const expected=hmac(body);const a=Buffer.from(sig),b=Buffer.from(expected);if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return null;const [userId,exp]=body.split(".");if(!userId||!(Number(exp)>Date.now()))return null;return userId;}
