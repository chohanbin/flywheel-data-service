import { AccountId } from "./Account";

type CustomerBaseSchema = {
  username: string;
  name: string;
  address: string;
  birthdate: string;
  email: string;
  accounts: AccountId[];
};

export type CustomerApiFormat = { id: string } & CustomerBaseSchema;

export type CustomerDbFormat = { _id: string } & CustomerBaseSchema;
