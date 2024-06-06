import { MongoClient, Db } from "mongodb";

export default class AnalyticsDataSource {
  private client: MongoClient;
  private isConnected: boolean = false;
  private db: Db;
  readonly dbName = "sample_analytics";
  readonly collTxns = "transactions";
  readonly fieldTxns = "transactions";

  constructor(connString: string) {
    this.client = new MongoClient(connString);
  }

  public async initialize() {
    if (!this.isConnected) {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.isConnected = true;
      console.log(`Connected to MongoDB: ${this.dbName}`);
    }
  }

  public getCollection(collectionName: string) {
    if (!this.isConnected) {
      throw new Error("MongoDB connection is not established");
    }
    return this.db.collection(collectionName);
  }

  async transactionBatch(accountId: number) {
    const coll = this.getCollection(this.collTxns);
    const txnBatch = await coll.findOne({ account_id: accountId });
    return txnBatch;
  }
}
