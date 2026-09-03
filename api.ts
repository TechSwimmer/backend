


import app from "./src/app"



import {appRouter} from './routes/index'

// Import the WebSocket adapter from tRPC. 
// This allows tRPC procedures to communicate through WebSockets.
import { applyWSSHandler } from '@trpc/server/adapters/ws';

import ws from '@fastify/websocket';


// import fastify middleware creator for fastify
import { fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,  } from "@trpc/server/adapters/fastify"


// Import WebSocketServer from the ws package. 
// This creates a WebSocket server.
import { WebSocketServer } from 'ws';

// createContext function. -creates request-specific context for every incoming request
import { createContext } from './context';
import { WebSocket } from "http";

// Create an Express application.
// const app = express();







app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
        router : appRouter,
        createContext,  
        onError({ path, error}){
            console.error(`Error on path ${path}: ${error.message}`)
        }
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions']
});
    

// define fastify server start function.
const start = async() => {
    try {
        await app.listen({ port:3000 });
        console.log("Server started at http://localhost:3000.....")
    }
    catch(err) {
        app.log.error(err);
        process.exit(1);
    }
};

// start the fastify server
start()


// app.register(ws)
// const wss = new ws({ server: app.server}) 

// applyWSSHandler connects: 
// WebSocket connection 
//    ↓ 
// WebSocketServer 
//    ↓ 
// tRPC WebSocket adapter 
//    ↓ 
// appRouter 
// createContext creates context for WebSocket connections, 
// allowing tRPC procedures to access ctx.
// applyWSSHandler({
//     wss,
//     router: appRouter,
//     createContext
// })

// Export the TYPE of appRouter. 
// This is extremely important for tRPC type safety. 
// The frontend can import this type and automatically know: 
// - Available routers 
// - Available procedures 
// - Input types 
// - Output types 
// without manually creating a separate API type definition.
export type AppRouter = typeof appRouter