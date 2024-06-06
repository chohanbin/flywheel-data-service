import { AccountId } from "./Account";

export type Customer = {
  username: string;
  name: string;
  address: string;
  birthdate: string;
  email: string;
  accounts: AccountId[];
};
