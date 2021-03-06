"use strict";

const query = require("./lib/query");

const event = {
  connectionUrl: process.env.CONNECTION_URL,
  sql: process.env.QUERY
};

console.log(`running query ${event.sql}`);
query(event)
  .then(() => {
    console.log("query completed");
  })
  .catch(err => {
    console.log(`failed to run query ${err.message}`);
    process.exit(1);
  });
