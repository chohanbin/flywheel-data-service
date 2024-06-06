const mockTransactions = [
  {
    date: "1205884800000",
    amount: 8592,
    transaction_code: "buy",
    symbol: "amd",
    price: "6.25868566899633460565155473886989057064056396484375",
    total: "53774.62726801650693175815832",
  },
  {
    date: "1211846400000",
    amount: 5360,
    transaction_code: "sell",
    symbol: "amd",
    price: "6.8846943545406844577883020974695682525634765625",
    total: "36901.96174033806869374529924",
  },
];

export const resolvers = {
  Query: {
    transactions: () => mockTransactions,
  },
};
