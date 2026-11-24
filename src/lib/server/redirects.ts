import { prisma } from "@/lib/db/prisma";
export function validateRedirect(sourcePath:string,destination:string){if(!sourcePath.startsWith("/")||!destination.startsWith("/"))throw new Error("Redirect paths must be local absolute paths");if(sourcePath===destination)throw new Error("Redirect cannot point to itself");}
export const findRedirect=(sourcePath:string)=>prisma.redirect.findFirst({where:{sourcePath,active:true}});
