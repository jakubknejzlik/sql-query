'use strict'

const Writable = require('flushwritable')
const mysql = require('mysql')

class SQLWriteStream extends Writable {

    constructor(options) {
        options.objectMode = true
        super(options)
        this.connectionUrl = options.connectionUrl
        this.destinationTable = options.destinationTable

        this.connection = mysql.createConnection(this.connectionUrl)

        this.buffer = []
        this.maxBufferSize = options.highWaterMark || 500
    }

    _write(object, encoding, callback) {
      this.buffer.push(object)
      if (this.maxBufferSize > this.buffer.length) return callback()
      this.processBuffer(callback)
    }

    _flush(callback) {
      this.processBuffer(callback)
    }

    processBuffer(callback) {
      if (this.buffer.length === 0) return callback()
      let objects = this.buffer
      this.buffer = []
      this.insertObjects(objects,callback)
    }

    insertObjects(objects, callback) {
      throw new Error('insertObjects not implemented')
    }
}

module.exports = SQLWriteStream