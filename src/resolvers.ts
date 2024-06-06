export const resolvers = {
  Query: {
    customer: async (_, { username }, { dataSources }) => {
      return await dataSources.analytics.customer(username);
    },
    transactionBatch: async (_, { accountId }, { dataSources }) => {
      return await dataSources.analytics.transactionBatch(accountId);
    },
  },
};
