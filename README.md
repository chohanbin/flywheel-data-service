# Flywheel Data Service

The mighty Flywheel Trading app's GraphQL API service. Its primary purpose is to serve user data to the web service.

# How to launch this service

Launch the GraphQL API service (at `localhost:4000` by default):

(To deploy the full stack application at once, please see https://github.com/chohanbin/flywheel-data-service)

### Using npm

Create `.env.local` file that specifies which MongoDB to target (Replace `<CONNECTION_STRING>` with the target DB URI, e.g. `'mongodb+srv://.../sample_analytics?...'` or `mongodb://localhost:27017`)

- **NOTE**: This service is compatible only with a MongoDB database with [Sample Analytics Dataset](https://www.mongodb.com/docs/atlas/sample-data/sample-analytics/) schema.

```shell
DB_CONN_STRING=<CONNECTION_STRING>
```

From the repo root directory, invoke:

```shell
npm install   # Only needs to be run once.
npm start     # Run every time the service needs to start.
```

Shut down the service with `Ctrl + D`.

### Using docker

If this is your first time running this service, run:

```shell
# If the output to this command returns nothing,
docker network ls | grep flywheel
# Then run
docker network create flywheel
```

Build the image with:

```shell
docker build -t flywheel-data-service .
```

Run a container (Replace `<CONNECTION_STRING>` with the target DB URI):

```shell
docker run --name data-service \    # the name that this service will be known to other services on 'flywheel' network
  --network flywheel \
  -dp 127.0.0.1:4000:4000 \
  -e DB_CONN_STRING='<CONNECTION_STRING>' \
  flywheel-data-service
```

// ^TODO: Add instruction on how to allow this docker service to connect to mongodb://localhost:27017

Shut down the service with:

```shell
docker ps | grep flywheel-data-service
```

Then run ([Explanation](https://docs.docker.com/get-started/03_updating_app/#remove-a-container-using-the-cli) of `docker rm -f`):

```shell
docker rm -f <target docker container ID>
```

# Supported GraphQL APIs

This service exposes the content of a MongoDB database in [Sample Analytics Dataset](https://www.mongodb.com/docs/atlas/sample-data/sample-analytics/) schema.

Currently, it supports fetching `customers` collection with `customer` query, and `transactions` collection with `transactionBatch` query, as shown below. For the official GraphQL schema, refer to [src/schema.graphql](https://github.com/chohanbin/flywheel-data-service/blob/main/src/schema.graphql)

Visit <http://localhost:4000> from your browser, to open up [Apollo Sandbox](https://www.apollographql.com/docs/apollo-server/getting-started#step-8-execute-your-first-query) from where you can submit these GraphQL queries against your local `flywheel-data-service`.

### Query: customer

Operation (omit fields as desired):

```graphql
query GetCustomer($email: String!) {
  customer(email: $email) {
    username
    name
    email
    accounts
  }
}
```

Variables (replace `appleseed` with your target `email`):

```javascript
{ "email": "johnny@appleseed.com" }
```

### Query: transactionBatch

Operation (omit fields as desired):

```graphql
query GetTransactionBatch($accountId: Int!) {
  transactionBatch(accountId: $accountId) {
    account_id
    transaction_count
    bucket_start_date
    bucket_end_date
    transactions {
      date
      amount
      transaction_code
      symbol
      price
      total
    }
  }
}
```

Variables (replace `123456` with your target `accountId`):

```javascript
{ "accountId": 123456 }
```

# How to run automated test

From the repo root directory, invoke:

```shell
npm test
```

# Author

Hanbin Cho
