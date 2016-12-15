'use strict';
const mysql = require('mysql');

class Connection{
    constructor(connectionUrl){
        this.connection = mysql.createConnection(connectionUrl);
    }

    executeSQL_select(sql, callback){
        this.connection.query(sql, function(err, rows){
            if(err)
                return callback(err);
            return callback(null, rows);
        });
    }

    exeSQL_pipe(sql){
        return this.connection.query(sql).stream();
    }

    closeConnection(){
        this.connection.end();
    }
}

module.exports = Connection