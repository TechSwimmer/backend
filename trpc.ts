import { initTRPC,TRPCError } from "@trpc/server"
import { createContext } from "./context"


export const t = 
    initTRPC.context<Awaited<ReturnType<typeof createContext>>>()
    .create()



// new procedure only for authenticated admin onl users
const isAdminMiddleware = t.middleware(({ ctx, next}) => {
    // check if the user is admin, if not throw an error
    if(!ctx.isAdmin) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }
    // return the ctx value with user object, so that the next 
    // procedure can use it
    return next({ ctx: { user: {id:28}}})
})

// create a procedure that uses the isAdminMiddleware, so that any procedure
// that uses this will require admin access
export const adminProcedure = t.procedure.use(isAdminMiddleware)