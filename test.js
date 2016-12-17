'use strict'

const fs = require('fs');
const MySQLReadStream = require('./lib/MySQLReadStream');
const MySQLWriteSream = require('./lib/MySQLWriteStream');

let data = [];

let read = new MySQLReadStream({connectionUrl:'mysql://root:changeit@localhost/test',sql:'SELECT * FROM users'});
let write = new MySQLWriteSream({connectionUrl:'mysql://root:changeit@localhost/test',destinationTable:'user2'});

read.on('end', function () {
    read.connection.closeConnection();
    write.end(()=> {
        write.connection.closeConnection();
        console.log("Writeable is end");
    });
});

read.pipe(write)
.on('error', error => console.log(error));

write.on('finish', () => {
    console.log('Finish writeable');
});
write.on('close', () => {
    console.log('Close writeable');
});
