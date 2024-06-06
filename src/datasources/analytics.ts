import { MongoClient, Db } from "mongodb";

export default class AnalyticsDataSource {
  private client: MongoClient;
  private isConnected: boolean = false;
  private db: Db;
  static readonly dbName = "sample_analytics";
  static readonly collTxns = "transactions";
  static readonly fieldTxns = "transactions";

  constructor(connString: string) {
    this.client = new MongoClient(connString);
  }

  public async initialize() {
    if (!this.isConnected) {
      await this.client.connect();
      this.db = this.client.db(AnalyticsDataSource.dbName);
      this.isConnected = true;
      console.log(`Connected to MongoDB: ${AnalyticsDataSource.dbName}`);
    }
  }

  public async close(): Promise<void> {
    await this.client.close();
    this.isConnected = false;
    console.log("MongoDB connection closed");
  }

  public getCollection(collectionName: string) {
    if (!this.isConnected) {
      throw new Error("MongoDB connection is not established");
    }
    return this.db.collection(collectionName);
  }

  async transactionBatch(accountId: number) {
    const coll = this.getCollection(AnalyticsDataSource.collTxns);
    const txnBatch = await coll.findOne({ account_id: accountId });
    return txnBatch;
  }
}
