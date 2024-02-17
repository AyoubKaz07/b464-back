import dotenv from "dotenv";
dotenv.config();
import jsonwebtoken from "jsonwebtoken";
import { connectDB } from "./config/connect.js";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { expressMiddleware } from "@apollo/server/express4";
import { mergedGQLSchema } from "./graphql/schema/index.js";
import { resolvers } from "./graphql/resolvers/index.js";
import cluster from "node:cluster";
import { cpus } from "node:os";
import process from "node:process";
import scheduleWeeklyJob from "./utils/newsletterScheduler.js";
import redisClient from "./config/redis.js";
const PORT = 3000;


const schema = makeExecutableSchema({
  typeDefs: mergedGQLSchema,
  resolvers,
});


const app = express();
const httpServer = createServer(app);

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
      return next();
    }
    
    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.json({ success: false, message: "Failed to authenticate token." });
        }
        console.log(token);

    req.user = decoded;
    next();
  });
};

app.use(verifyToken);
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),

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

app.use(
  "/graphql",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: ({ req }) => ({ user: req.user}),
  })
);

// Only create the server in the master process
if (cluster.isPrimary) {
  // Fork workers
  const numCPUs = cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  // Handle worker exit
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Workers share the same HTTP server
  httpServer.listen(PORT, () => {
    redisClient.connect();
    connectDB(process.env.MONGO_URI);
    console.log(
      `Worker ${process.pid} is now running on http://localhost:${PORT}/graphql`
    );
  });
}