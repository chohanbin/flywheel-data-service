export type TransactionBatch = {
  account_id: number;
  transaction_count: number;
  bucket_start_date: string;
  bucket_end_date: string;
  transactions: Transaction[];
};

export type Transaction = {
  date: string;
  amount: number;
  transaction_code: string;
  symbol: string;
  price: string;
  total: string;
};
