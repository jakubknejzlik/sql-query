'use strict'

const MySQLReadStream = require('./lib/MySQLReadStream')

let data = [];

let read = new MySQLReadStream({connectionUrl:'mysql://root:changeit@localhost/testdb',sql:'SELECT * FROM table1'});

read.on('error', error => console.error(error));

read.on('data', function (chunk) {
    data.push(chunk.toString('utf8'));
});

read.on('end', function () {
    console.log(data);
    this.connection.closeConnection();
});