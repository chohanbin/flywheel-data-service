import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fs from "fs";
import { resolvers } from "./resolvers.js";
import AnalyticsDataSource from "./datasources/analytics.js";
import { config } from "dotenv";

if (process.env.DB_CONN_STRING == null) config({ path: ".env.local" });

const typeDefs = fs.readFileSync("src/schema.graphql", "utf8");

export interface ContextValue {
  dataSources: {
    analytics: AnalyticsDataSource;
  };
}

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

  console.log(`🛞🚀 Flywheel Data Service ready at: ${url}`);
};

startServer();
