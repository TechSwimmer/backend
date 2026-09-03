import { type CreateExpressContextOptions } from '@trpc/server/adapters/express'

// export function createContext({ req, res }: CreateExpressContextOptions) {
//     return {
//         req,
//         res,
//         isAdmin : true,
//     }
// }


export function createContext() {
    return {
       
        isAdmin : true,
    }
}