'use strict'

const MySQLReadStream = require('./lib/MySQLReadStream')
const Connection = require('./lib/Connection');

let data = [];

let read = new MySQLReadStream({connectionUrl:'mysql://root:changeit@localhost/testdb',sql:'SELECT * FROM table1'});

read.read();

read.on('error', error => console.error(error));

read.on('data', function (chunk) {
    data.push(chunk);
});

read.on('end', function () {
    console.log(JSON.parse(data));
    this.connection.closeConnection();
});