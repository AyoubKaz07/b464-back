import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db/connect.js";
import express from "express";
import cors from "cors";
import { ApolloServer } from '@apollo/server';
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { expressMiddleware } from "@apollo/server/express4";
import { mergedGQLSchema } from "./graphql/schema/index.js";
import { resolvers } from "./graphql/resolvers/index.js";
import cluster from 'node:cluster';
import { cpus } from 'node:os';
import process from "node:process";
import scheduleWeeklyJob from "./utils/newsletterScheduler.js";
const PORT = 3000;


const schema = makeExecutableSchema({
    typeDefs: mergedGQLSchema,
    resolvers,
});


const app = express();
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
});
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
    schema,
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
    introspection: true,
});

await server.start();
scheduleWeeklyJob.start();
app.use("/graphql", cors(), express.json(), expressMiddleware(server));

// Only create the server in the master process
if (cluster.isPrimary) {
    // Fork workers
    const numCPUs = cpus().length;
    for (let i = 0; i < numCPUs - 11; i++) {
        cluster.fork();
    }

    // Handle worker exit
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    // Workers share the same HTTP server
    httpServer.listen(PORT, async () => {
        connectDB(process.env.MONGO_URI);
        console.log(`Worker ${process.pid} is now running on http://localhost:${PORT}/graphql`);
    });
}
