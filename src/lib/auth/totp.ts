import { TOTP } from "otpauth";
export function newTotp(secret?:string){return new TOTP({issuer:process.env.TOTP_ISSUER||"KASH Technology",label:"Admin",algorithm:"SHA1",digits:6,period:30,secret});}
export const verifyTotp=(secret:string,token:string)=>newTotp(secret).validate({token,window:1})!==null;
