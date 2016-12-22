'use strict'

const url = require('url')

const connections = {
  mssql: require('./lib/mssql'),
  mysql: require('./lib/mysql')
}

exports.handler = (event, context, callback) => {
  let sourceConnectionURL = event.sourceConnection
  let sourceSQL = event.sourceSQL
  let destinationConnectionURL = event.destinationConnection
  let destinationTable = event.destinationTable

  let _sourceConnectionURL = url.parse(sourceConnectionURL)
  let _destinationConnection = url.parse(destinationConnectionURL)

  let source = connections[_sourceConnectionURL.protocol]
  let destination = connections[_destinationConnection.protocol]

  if(!source) return callback(new Error('source protocol not supported'))
  if(!destination) return callback(new Error('destination protocol not supported'))

  let read = source.createReadStream({connectionUrl: sourceConnectionURL, sql: sourceSQL})
  let write = source.createReadStream({connectionUrl: destinationConnectionURL, destinationTable: destinationTable})

  write.on('finish',() => {
    callback()
  })

  write.on('error',callback)
  read.on('error',callback)

  read.pipe(write)
}