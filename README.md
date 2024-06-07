# Flywheel Data Service

The mighty Flywheel Trading app's GraphQL API service. Its primary purpose is to serve user data to the web service.

# How to run

Launch the GraphQL API service locally (at port `4000` by default):

### Using npm

Create `.env.local` file that specifies which MongoDB to target (Replace `<CONNECTION_STRING>` with the target DB URI, e.g. `'mongodb+srv://.../sample_analytics?...'` or `mongodb://localhost:27017`)

```shell
DB_CONN_STRING=<CONNECTION_STRING>
```

From the repo root directory, invoke:

```shell
npm install
npm start
```

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
docker run -dp 127.0.0.1:4000:4000 \
  --network flywheel \
  -e DB_CONN_STRING='<CONNECTION_STRING>' \
  flywheel-data-service
```

# ^TODO: Add instruction on how to allow this docker service to connect to mongodb://localhost:27017

# How to run automated test

From the repo root directory, invoke:

```shell
npm test
```

# Author

Hanbin Cho
