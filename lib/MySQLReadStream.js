'use strict'

const Readable = require('stream').Readable;
const MySQLConnection = require('./MySQLConnection');

class MySQLReadStream extends Readable {
    constructor(options) {
        super(options)
        this.connectionUrl = options.connectionUrl
        this.sql= options.sql;

        this.connection = new MySQLConnection(this.connectionUrl);

        this.streams = this.connection.exeSQL(this.sql)
        .on('result', data => {
            // param of push just accept non-string or buffer
            this.push(new Buffer(JSON.stringify(data)));
        })
        .on('end', () => {
            this.push(null);
        })
        .on('error', error => {
            console.log(error);
            this.push(null);
        })
        .on('close', () => {
            this.push(null);
        })
        .on('finish', () => console.log('finish'));
    }

    _read(size) {
    }

}

module.exports = MySQLReadStream