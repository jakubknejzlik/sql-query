'use strict'

const Writable = require('stream').Writable;

class MySQLWriteStream extends Writable {
    constructor(options) {
        super(options)
        this.connectionUrl = options.connectionUrl
        this.destinationTable = options.destinationTable
    }
}

module.exports = MySQLWriteStream