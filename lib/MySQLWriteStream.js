'use strict'

const Writable = require('stream').Writable;
const MySQLConnection = require('./MySQLConnection');

class MySQLWriteStream extends Writable {
    constructor(options) {
        super(options)
        this.connectionUrl = options.connectionUrl
        this.destinationTable = options.destinationTable

        this.connection = new MySQLConnection(this.connectionUrl);
    }

    _write(chunk, encoding, callback){
        console.log(JSON.parse(chunk.toString()));
        let rowJSON = JSON.parse(chunk.toString());
        let birthdate = new Date(rowJSON.birthdate);

        let sql = `INSERT INTO \`users2\` (\`username\`,\`firstname\`,\`lastname\`,\`birthdate\`) VALUES ('${rowJSON.username}','${rowJSON.firstname}','${rowJSON.lastname}','${birthdate.getFullYear()}/${birthdate.getMonth()}/${birthdate.getDay()}')`;
        console.log(sql);
        this.connection.exeSQL(sql);
        callback();
    }
}

module.exports = MySQLWriteStream