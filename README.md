# sql-query

Run sql queries in docker container.

## Running tests

For running tests you need `docker` (and `docker-compose`) installed.

For running complete tests use:

`npm run integration-tests --silent`

When developing you can use this approach:

```
// start mysql container
docker-compose up mysql

// then run tests on each iteration
npm test --silent
```

When you are done working, you can stop all containers by running:

`npm run stop-all-containers`
