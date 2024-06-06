import { Customer } from "../../src/types/Customer";
import { TransactionBatch } from "../../src/types/Transaction";

export const seedCollCust: Customer[] = [
  {
    username: "appleseed",
    name: "Johnny Appleseed",
    address: "678 Orchard Lane, Apple Valley, CA 92307",
    birthdate: new Date("1974-09-26").getTime().toString(),
    email: "johnny@appleseed.com",
    accounts: [987123, 345987],
  },
  {
    username: "poppins",
    name: "Mary Poppins",
    address: "1600 Dream St, Los Angeles, CA 90028",
    birthdate: new Date("1964-12-23").getTime().toString(),
    email: "merry@poppins.net",
    accounts: [246801, 777777, 999999, 111111],
  },
];

export const seedCollTxns: TransactionBatch[] = [
  {
    account_id: 123456,
    transaction_count: 2,
    bucket_start_date: new Date("2021-02-03").getTime().toString(),
    bucket_end_date: new Date("2021-03-04").getTime().toString(),
    transactions: [
      {
        date: new Date("2021-02-03").getTime().toString(),
        amount: 10,
        transaction_code: "buy",
        symbol: "amzn",
        price: "6.5",
        total: "65",
      },
      {
        date: new Date("2021-03-04").getTime().toString(),
        amount: 20,
        transaction_code: "buy",
        symbol: "goog",
        price: "12",
        total: "240",
      },
    ],
  },
  {
    account_id: 333333,
    transaction_count: 3,
    bucket_start_date: new Date("2020-04-04").getTime().toString(),
    bucket_end_date: new Date("2022-06-06").getTime().toString(),
    transactions: [
      {
        date: new Date("2020-04-04").getTime().toString(),
        amount: 20,
        transaction_code: "buy",
        symbol: "amd",
        price: "20",
        total: "400",
      },
      {
        date: new Date("2021-05-05").getTime().toString(),
        amount: 10,
        transaction_code: "sell",
        symbol: "amd",
        price: "25",
        total: "500",
      },
      {
        date: new Date("2022-06-06").getTime().toString(),
        amount: 30,
        transaction_code: "buy",
        symbol: "amd",
        price: "30",
        total: "900",
      },
    ],
  },
];
