// fastify server creation and configuration is done in this file, 
// so that it can be imported in api.ts and used to start the server


import Fastify from "fastify"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"     // helmet help secure your Fastify app by setting various HTTP headers.
import jwt  from "@fastify/jwt"          // jwt 
// initialize fastify
const app = Fastify({
    logger: true,
    routerOptions: {
        maxParamLength: 5000, 
    }
})

// cors configured
app.register(cors, { 
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
  })

// helmet configured -- initial
app.register(helmet)

// jwt config --  initial
app.register(jwt, {
    secret: 'its-hidden'
})  



// Root route for testing the server.
app.get("/", async (request, reply) => {
    return { message: "Hello from Fastify!" };
})

// export the fastify app instance for use in api.ts to start the server
export default app;


