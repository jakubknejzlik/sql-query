'use strict'

const url = require('url')

const connections = {
  mssql: require('./lib/mssql'),
  mysql: require('./lib/mysql')
}

exports.handler = (event, context, callback) => {
  console.log('transfering',event)
  let sourceConnectionURL = event.sourceConnection
  let sourceSQL = event.sourceSQL
  let destinationConnectionURL = event.destinationConnection
  let destinationTable = event.destinationTable

  let _sourceConnectionURL = url.parse(sourceConnectionURL)
  let _destinationConnectionURL = url.parse(destinationConnectionURL)

  let source = connections[_sourceConnectionURL.protocol.replace(':','')]
  let destination = connections[_destinationConnectionURL.protocol.replace(':','')]

  if(!source) return callback(new Error('source protocol not supported'))
  if(!destination) return callback(new Error('destination protocol not supported'))

  let read = source.createReadStream({connectionUrl: sourceConnectionURL, sql: sourceSQL})
  let write = destination.createWriteStream({connectionUrl: destinationConnectionURL, table: destinationTable})

  write.on('finish',() => {
    console.log('transfer finished',event)
    callback()
  })

  write.on('error',callback)
  read.on('error',callback)

  read.pipe(write)
}