import { ApolloServer } from "@apollo/server";
import fs from "fs";
import { resolvers } from "../src/resolvers";
import assert from "assert";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, Db, Collection, Document } from "mongodb";
import AnalyticsDataSource from "../src/datasources/analytics";
import { seedCollCust } from "./seed/seed";
import { seedCollTxns } from "./seed/seed";
import { ContextValue } from "../src/server";
import { CustomerApiFormat } from "../src/types/Customer";
import { TransactionBatch } from "../src/types/Transaction";

const typeDefs = fs.readFileSync("src/schema.graphql", "utf8");
const ID_KEY_API_FORMAT = "id";
const ID_KEY_DB_FORMAT = "_id";

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
    const indicesOfSeedBatches = [...Array(seedCollTxns.length).keys()];
    indicesOfSeedBatches.forEach((index) => {
      const expectedBatch = seedCollTxns[index];
      const expectedAccountId = expectedBatch.account_id;

      it(`returns the correct transaction batch for the given accountId: ${expectedAccountId}`, async () => {
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
          if (key === ID_KEY_DB_FORMAT) continue;
          expect(actualBatch[key]).toEqual(expectedBatch[key]);
        }
      });
    });
  });

  describe("customer", () => {
    const indicesOfSeedCust = [...Array(seedCollCust.length).keys()];
    indicesOfSeedCust.forEach((index) => {
      const expectedCust = seedCollCust[index];
      const expectedUsername = expectedCust.username;

      it(`returns the correct customer for the given username: ${expectedUsername}`, async () => {
        const response = await testServer.executeOperation(
          {
            query: `#graphql
              query GetCustomer($username: String!) {
                customer(username: $username) {
                  username
                  name
                  email
                  accounts
                }
              }
            `,
            variables: { username: expectedUsername },
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
        const actualCust = response.body.singleResult.data
          ?.customer as CustomerApiFormat;
        for (const key in actualCust) {
          if (key === ID_KEY_API_FORMAT) {
            expect(actualCust[ID_KEY_API_FORMAT]).toEqual(
              expectedCust[ID_KEY_DB_FORMAT],
            );
          } else {
            expect(actualCust[key]).toEqual(expectedCust[key]);
          }
        }
      });
    });
  });
});
