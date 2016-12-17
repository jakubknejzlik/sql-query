'use strict'

const assert = require('assert')
const mysql = require('mysql')

const MySQLReadStream = require('../lib/MySQLReadStream')
const MySQLWriteStream = require('../lib/MySQLWriteStream')

const fixtures = require('./fixtures')

let pipeInTestDB = (select,destinationTable,callback) => {
  let read = new MySQLReadStream({connectionUrl:'mysql://root:test@localhost/test',sql:select})
  let write = new MySQLWriteStream({connectionUrl:'mysql://root:test@localhost/test',destinationTable:destinationTable})

  read.on('end', function () {
    read.connection.closeConnection();
    write.end(()=> {
      write.connection.closeConnection();
      callback();
    });
  });


  read.on('error',callback)
  write.on('error',callback)

  read.pipe(write)
}

describe('handler', () => {

    beforeEach(() => {
        return fixtures.prepare()
    })

    it('should pipe users -> users2 and finish', (done) => {
        pipeInTestDB('SELECT * FROM users','users2',() => {
          setTimeout(() => {
              let connection = mysql.createConnection('mysql://root:test@localhost/test')
              connection.query('SELECT (SELECT COUNT(*) from users) as count1, (SELECT COUNT(*) from users2) as count2',(err, result) => {
                  assert.
                  done()
              })
          })
        })
    })

    it('should be able to pipe users -> users2 and finish multiple times', (done) => {
        pipeInTestDB('SELECT * FROM users','users2',(err) => {
            assert.ok(!err,'did fail with error ' + (err?err.message:''))
            pipeInTestDB('SELECT * FROM users','users2',(err) => {
                assert.ok(!err,'did fail with error ' + (err?err.message:''))
                pipeInTestDB('SELECT * FROM users','users2',done)
            })
        })
    })

    it('should pipe cars -> anothercars and finish', (done) => {
        pipeInTestDB('SELECT name as name2, brand as branding FROM cars','anothercars',done)
    })
})