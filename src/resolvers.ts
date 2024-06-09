import { CustomerDbFormat } from "./types/Customer";

export function mapCustomerDbToApiFormat(customer: CustomerDbFormat) {
  return {
    ...customer,
    id: customer._id,
    _id: undefined,
  };
}

export const resolvers = {
  Query: {
    customer: async (_, { email }, { dataSources }) => {
      const data = await dataSources.analytics.customer(email);
      return mapCustomerDbToApiFormat(data);
    },
    transactionBatch: async (_, { accountId }, { dataSources }) => {
      return await dataSources.analytics.transactionBatch(accountId);
    },
  },
};
