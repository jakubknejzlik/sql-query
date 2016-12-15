'use strict'

const Readable = require('stream').Readable;
const Connection = require('./Connection');

class MySQLReadStream extends Readable {
    constructor(options) {
        super(options)
        this.connectionUrl = options.connectionUrl
        this.sql= options.sql

        this.setEncoding('utf8')

        this.connection = new Connection(this.connectionUrl);

        this.sql = options.sql;
    }

    _read(size) {

        this.pause()
        this.connection.executeSQL_select(this.sql, (err, data) => {
            this.resume();
            if(err){
                this.emit('error', err);
            }
            
            this.push(JSON.stringify(data));
            this.push(null);
        });
    }

}

module.exports = MySQLReadStream