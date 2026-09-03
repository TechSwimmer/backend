import { t } from '../trpc'
import { usersRouter } from './users'
import { adminProcedure } from '../trpc'


export const appRouter = t.router({
    sayHi: t.procedure.query(() => {
        return "sayHi route works"
    }),
    logToServer: t.procedure.input((val :any) => {
        if(typeof val === 'string') return val
        throw new Error("Invalid input: expected a string")
    })
    .mutation(req => {
        console.log(`Client says : ${req.input}`)
        return true
    }),
    // adminProcedure is used here to protect this route, so that 
    // only admin users can access it
    adminData : adminProcedure.query(({ ctx }) => {
        console.log(ctx.user)
        return `secret data for user ${ctx.user.id}`
    }),
    users : usersRouter,
    
})

// we can merge two different routes like this 
// const mergedRouters = t.mergeRouters(appRouter, usersRouter)