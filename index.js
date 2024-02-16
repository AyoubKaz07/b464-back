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

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({
    typeDefs: mergedGQLSchema,
    resolvers,
});

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
    server: httpServer,
    // path has to match our graphql endpoint in the client ?
    path: "/graphql",
});
// Save the returned server's info so we can shutdown this server later
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
app.use("/graphql", cors(), express.json(), expressMiddleware(server));

const PORT = 3000;
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
    connectDB(process.env.MONGO_URI);
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});