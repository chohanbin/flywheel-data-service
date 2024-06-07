import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fs from "fs";
import { resolvers } from "./resolvers.js";
import AnalyticsDataSource from "./datasources/analytics.js";
import { config } from "dotenv";
const typeDefs = fs.readFileSync("src/schema.graphql", "utf8");

export interface ContextValue {
  dataSources: {
    analytics: AnalyticsDataSource;
  };
}

// DB_CONN_STRING may be passed in as an in-line env variable with `docker run`.
// Default to reading from .env.local if not provided.
if (process.env.DB_CONN_STRING == null) config({ path: ".env.local" });

export const startServer = async () => {
  const analyticsDS = new AnalyticsDataSource(process.env.DB_CONN_STRING);
  await analyticsDS.initialize();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => {
      return {
        dataSources: {
          analytics: analyticsDS,
        },
      };
    },
    listen: { port: 4000 },
  });

  const exitSignals = ["SIGTERM", "SIGINT"];
  exitSignals.forEach((signal) => {
    process.on(signal, async () => {
      console.log(`Received ${signal}`);
      await analyticsDS.close();
      process.exit(0);
    });
  });

  console.log(`🛞🚀 Flywheel Data Service ready at: ${url}`);
};

startServer();
