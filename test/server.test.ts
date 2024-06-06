import { ApolloServer } from "@apollo/server";
import fs from "fs";
import { mockTransactions, resolvers } from "../src/resolvers";
import assert from "assert";

const typeDefs = fs.readFileSync("src/schema.graphql", "utf8");

describe("server", () => {
  describe("transactions", () => {
    it("returns the mocked data of the correct format", async () => {
      const server = new ApolloServer({
        typeDefs,
        resolvers,
      });
      const response = await server.executeOperation({
        query: `#graphql
                    query ListTransactions {
                        transactions {
                            date
                            amount
                            transaction_code
                            symbol
                            price
                            total
                        }
                    }
                `,
      });
      assert(response.body.kind === "single");
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.transactions).toEqual(
        mockTransactions,
      );
    });
  });
});
