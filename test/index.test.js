'use strict'

const assert = require('assert')
const MySQLReadStream = require('../lib/MySQLReadStream')
const MySQLWriteStream = require('../lib/MySQLWriteStream')

describe('handler', () => {
    it('should pipe streams', (done) => {
    //    this will not work yet, it's just example of how the library should be used

        let read = new MySQLReadStream({connectionUrl:'mysql://root@localhost/testdb',sql:'SELECT * FROM table1'})
        let write = new MySQLWriteStream({connectionUrl:'mysql://root@localhost/testdb',destinationTable:'table2'})

        read.on('close', () => {
            done()
        })

        read.on('error',done)
        write.on('error',done)

        read.pipe(write)
    })
})