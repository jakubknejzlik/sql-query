'use strict'

const Readable = require('stream').Readable;

class MySQLReadStream extends Readable {
    constructor(options) {
        super(options)
        this.connectionUrl = options.connectionUrl
        this.sql= options.sql
    }
}

module.exports = MySQLReadStream