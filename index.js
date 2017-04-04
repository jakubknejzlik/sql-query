'use strict'

const query = require('./lib/query')

const event = {
  connectionUrl: process.env.CONNECTION_URL,
  sql: process.env.SQL
}

console.log(`transfering ${event.sourceSQL}=>${event.destinationTable}`)
query(event).then(() => {
  console.log('query completed')
}).catch((err) => {
  console.log(`failed to run query ${err.message}`)
})
