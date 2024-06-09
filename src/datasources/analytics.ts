import { MongoClient, Db } from "mongodb";

export default class AnalyticsDataSource {
  private client: MongoClient;
  private isConnected: boolean = false;
  private db: Db;
  static readonly dbName = "sample_analytics";
  static readonly collCust = "customers";
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

  async customer(email: string) {
    const coll = this.getCollection(AnalyticsDataSource.collCust);
    // TODO: In rare cases, a given username or email
    //       can resolve to multiple customers:
    //       - email: 'jenn...9@...' => name: ['Alex ...', 'David ...']
    //       - username: 'ihi...' => name: ['... Thomas', '... Smith']
    //       - username: 'pat...5' => name: ['Jamie ...', 'Curtis ...']
    // For now, just return the first match, but as soon as possible,
    // understand whether these duplicates are allowed, and if so, in which case,
    // then handle fetching a unique customer properly.
    // (Perhaps by a combination of username and email, for example).
    return await coll.findOne({ email: email });
  }

  // TODO idea: sort the transactions by date at the DB level,
  //            so that the frontend won't have to before displaying to the user.
  //            Something like this could work:
  // collection.aggregate([
  //     {
  //         $match: {
  //             account_id: accountId
  //         }
  //     },
  //     {
  //         $project: {
  //             _id: 0,
  //             transactions: {
  //                 $sortArray: {
  //                     input: "$transactions",
  //                     sortBy: { date: 1 }
  //                 }
  //             }
  //         }
  //     }
  // ])
  async transactionBatch(accountId: number) {
    const coll = this.getCollection(AnalyticsDataSource.collTxns);
    // TODO: In rare cases, a given account_id
    //       can resolve to multiple transaction batches:
    //       - account_id: '627...' returns 2 batches.
    // For now, just return the first match, but as soon as possible,
    // understand whether these duplicates are allowed, and if so, in which case,
    // then handle multiple transaction batches properly.
    // (Perhaps by merging the batches directly, if there won't be duplicate transactions).
    return await coll.findOne({ account_id: accountId });
  }
}
