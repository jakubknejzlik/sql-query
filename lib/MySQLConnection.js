'use strict';
const mysql = require('mysql');

class MySQLConnection{
    constructor(connectionUrl){
        this.connection = mysql.createConnection(connectionUrl);
    }

    exeSQL(sql){
        return this.connection.query(sql);
    }

    closeConnection(){
        this.connection.end();
    }
}

module.exports = MySQLConnection