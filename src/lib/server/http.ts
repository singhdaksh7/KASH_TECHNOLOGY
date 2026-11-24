import { NextResponse } from "next/server";
export const ok = <T>(data:T, status=200) => NextResponse.json({success:true,data},{status});
export const fail = (code:string, message:string, status=400, details?:unknown) => NextResponse.json({success:false,error:{code,message,details}},{status});
export const requestIp=(r:Request)=>r.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||r.headers.get("x-real-ip")||"unknown";
export const hash=(value:string)=>{ let h=0; for(let i=0;i<value.length;i++)h=(h*31+value.charCodeAt(i))|0; return String(h); };
