export type AccountId = number;

export type Account = {
  account_id: AccountId;
  limit: number;
  products: string[];
};
