'use strict'

const Writable = require('flushwritable')
const mysql = require('mysql')

class SQLWriteStream extends Writable {

    constructor(options) {
        options.objectMode = true
        super(options)
        this.connectionUrl = options.connectionUrl
        this.table = options.table

        this.buffer = []
        this.maxBufferSize = options.highWaterMark || 500
    }

    _write(object, encoding, callback) {
      this.buffer.push(object)
      if (this.maxBufferSize > this.buffer.length) return callback()
      this.processBuffer(callback)
    }

    _flush(callback) {
      this.processBuffer((err) => {
        this.closeConnection()
        callback(err)
      })
    }

    processBuffer(callback) {
      if (!this.connection) {
        this.createConnection(() => {
          this.processBuffer(callback)
        })
        return
      }
      if (this.buffer.length === 0) return callback()
      let objects = this.buffer
      this.buffer = []
      this.insertObjects(objects,callback)
    }

    createConnection() {
      throw new Error('createConnection not implemented')
    }

    closeConnection() {
      throw new Error('closeConnection not implemented')
    }

    insertObjects(objects, callback) {
      throw new Error('insertObjects not implemented')
    }
}

module.exports = SQLWriteStream