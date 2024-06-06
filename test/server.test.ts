import { ApolloServer } from "@apollo/server";
import fs from "fs";
import { resolvers } from "../src/resolvers";
import assert from "assert";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, Db, Collection, Document } from "mongodb";
import AnalyticsDataSource from "../src/datasources/analytics";
import { seedCollTxns } from "./seed/seed";
import { ContextValue } from "../src/server";
import { TransactionBatch } from "../src/types/Transaction";

const typeDefs = fs.readFileSync("src/schema.graphql", "utf8");
const KEY_HIDDEN_OBJECT_ID = "_id";

let testDbServer: MongoMemoryServer;
let testDbClient: MongoClient;
let testDb: Db;
let testCollTxns: Collection<Document>;
let testServer: ApolloServer<ContextValue>;
let testAnalyticsDS: AnalyticsDataSource;

describe("server", () => {
  beforeAll(async () => {
    try {
      // setup test database
      testDbServer = await MongoMemoryServer.create();
      const client = await new MongoClient(testDbServer.getUri());
      testDbClient = await client.connect();
      testDb = testDbClient.db(AnalyticsDataSource.dbName);
      testCollTxns = testDb.collection(AnalyticsDataSource.collTxns);
      await testCollTxns.insertMany(seedCollTxns);

      // setup test analytics datasource
      testAnalyticsDS = await new AnalyticsDataSource(testDbServer.getUri());
      await testAnalyticsDS.initialize();

      // setup test server
      testServer = new ApolloServer<ContextValue>({
        typeDefs,
        resolvers,
      });
    } catch (err) {
      console.error("Failed to set up test service:", err);
    }
  });

  afterAll(async () => {
    // shut down all resources started in beforeAll
    try {
      await testAnalyticsDS.close();
      await testDbClient.close();
      await testDbServer.stop();
    } catch (err) {
      console.error("Failed to clean up test service:", err);
    }
  });

  describe("transactionBatch", () => {
    it("returns the correct transaction batch for the given accountId", async () => {
      const expectedBatch = seedCollTxns[0];
      const expectedAccountId = expectedBatch.account_id;

      const response = await testServer.executeOperation(
        {
          query: `#graphql
            query GetTransactionBatch($accountId: Int!) {
              transactionBatch(accountId: $accountId) {
                account_id
                transaction_count
                bucket_start_date
                bucket_end_date
                transactions {
                  date
                  amount
                  transaction_code
                  symbol
                  price
                  total
                }
              }
            }
          `,
          variables: { accountId: expectedAccountId },
        },
        {
          contextValue: {
            dataSources: {
              analytics: testAnalyticsDS,
            },
          },
        },
      );

      assert(response.body.kind === "single");
      expect(response.body.singleResult.errors).toBeUndefined();
      const actualBatch = response.body.singleResult.data
        ?.transactionBatch as TransactionBatch;
      // Validate all fields except the hidden ID field.
      for (const key in actualBatch) {
        if (key === KEY_HIDDEN_OBJECT_ID) continue;
        expect(actualBatch[key]).toEqual(expectedBatch[key]);
      }
    });
  });
});
