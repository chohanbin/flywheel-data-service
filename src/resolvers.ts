export const resolvers = {
  Query: {
    transactionBatch: async (_, { accountId }, { dataSources }) => {
      return await dataSources.analytics.transactionBatch(accountId);
    },
  },
};
