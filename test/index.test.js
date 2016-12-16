'use strict'

const assert = require('assert')
const MySQLReadStream = require('../lib/MySQLReadStream')
const MySQLWriteStream = require('../lib/MySQLWriteStream')

const fixtures = require('./fixtures')

describe('handler', () => {

    beforeEach(() => {
        return fixtures.prepare()
    })

    it('should pipe streams and finish', (done) => {
        let read = new MySQLReadStream({connectionUrl:'mysql://root:test@localhost/test',sql:'SELECT * FROM users'})
        let write = new MySQLWriteStream({connectionUrl:'mysql://root:test@localhost/test',destinationTable:'users2'})

        read.on('close', () => {
            done()
        })

        read.on('error',done)
        write.on('error',done)

        read.pipe(write)
    })
})