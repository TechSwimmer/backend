
import { t } from '../trpc'
import { z } from 'zod'

// Import observable from tRPC. 
// An observable allows a subscription to continuously receive 
// values/events over time instead of returning only one response.
import { observable } from '@trpc/server/observable'

// Import Node.js EventEmitter. 
// EventEmitter allows different parts of the server to: 
// - emit an event 
// - listen for that event 
// In this example, the "update" event is emitted whenever 
// a user is updated.
import { EventEmitter } from 'stream'

// usersProcedure defines a reusable base procedure requiring userId. 
// The get procedure uses that input requirement unchanged, while the
// update procedure extends it with another input schema requiring 
// name. Therefore update requires both userId and name.



// Create an EventEmitter instance. 
// This acts as a simple event system: 
// update mutation 
//    ↓ 
// eventEmitter.emit("update", data) 
//    ↓ 
// EventEmitter notifies listeners 
//    ↓ 
// onUpdate subscription receives the event
const eventEmitter = new EventEmitter()



// Create a reusable base procedure. 
// This procedure requires the input to contain: 
// { // userId: number // } 
// Any procedure built from usersProcedure automatically 
// requires userId as part of its input.
const usersProcedure = t.procedure.input(z.object({
    userId: z.number()
}))


// Create and export the usersRouter. 
// A router groups related tRPC procedures. 
// This router contains: 
// users.get 
// users.update 
// users.onUpdate
export const usersRouter = t.router({
    get: usersProcedure.query((v) => {
        return { id: v.input.userId }
    }),
    update: usersProcedure.input(z.object({
        name: z.string()
    }))
        .output(z.object({
            id: z.number(),
            name: z.string()
        }))
        .mutation(req => {

            console.log(`Updating user ${req.input.userId} with name ${req.input.name}`)
            eventEmitter.emit("update", req.input.userId)
            return { id: req.input.userId, name: req.input.name }

        }),

    
    // -------------------------------------------------- 
    // // USER UPDATE SUBSCRIPTION 
    // // -------------------------------------------------- 
    // A subscription keeps a connection open so the server 
    // can continuously send events/data to the client. 
    // Unlike a query or mutation: 
    // Query: 
    // Client → Server → One response 
    // Mutation: 
    // Client → Server → Perform action → One response 
    // Subscription: 
    // Client → Server 
    // ↑ 
    // │ 
    // └── Server can continuously send events //
    onUpdate: t.procedure.subscription(() => {
        return observable<string>((emit) => {
            eventEmitter.on("update", emit.next)


            return () => {
                eventEmitter.off("update", emit.next)
            }
        })
    })

})  