'use strict'

const assert = require('assert')
const mysql = require('mysql')

const mysqlStreams = require('../lib/mysql')
const mssqlStreams = require('../lib/mssql')
const handler = require('../lib/transfer')

const fixtures = require('./fixtures')

let pipeInTestDB = (select,table,callback) => {

  let read = mysqlStreams.createReadStream({connectionUrl:'mysql://root:test@localhost/test',sql:select})
  let write = mysqlStreams.createWriteStream({connectionUrl:'mysql://root:test@localhost/test',table:table})

  write.on('finish', function () {
      callback();
  });


  read.on('error',callback)
  write.on('error',callback)

  read.pipe(write)
}

let checkTableEquality = (tableName1, tablename2, callback) => {
  let connection = mysql.createConnection('mysql://root:test@localhost/test')
  connection.query(`SELECT (SELECT COUNT(*) from ${tableName1}) as count1, (SELECT COUNT(*) from ${tablename2}) as count2`,(err, result) => {
    assert.equal(result[0].count1,result[0].count2)
    connection.end()
    callback()
  })
}

describe('handler', () => {

    beforeEach(() => {
        return fixtures.prepare()
    })

    it('should pipe users -> users2 and finish', (done) => {
        pipeInTestDB('SELECT * FROM users','users2',() => {
          checkTableEquality('users','users2',done)
        })
    })

  it.skip('test', (done) => {
    let sql = `SELECT type
    ,number
    ,name
    ,vs
    ,amount_czk
    ,amount_foreign
    ,currency
    ,maturity_date
    ,CONVERT(varchar(23), [presumption_maturity_date], 121) as presumption_maturity_date
    ,CONVERT(varchar(23), [paid_date], 121) as paid_date
    ,days_after_due_date
    ,total_after_due_date
    FROM [db19465_Metrum].[db19465_Metrum].[IFS_NC_credit_debt]
    where amount_czk<>0 or amount_foreign<>0`
    handler({
      sourceConnection: 'mssql://db19465_metrum:@mssql15.profiwh.com/db19465_metrum',
      sourceSQL: sql,
      destinationConnection: 'mysql://udidb:@udi.cadqzpnixpvb.eu-central-1.rds.amazonaws.com:3306/udidb_metrum',
      destinationTable: 'creditdebts'
    },{},(err)=> {
      console.log(err)
      done(err)
    })
  })

    it('should be able to pipe users -> users2 and finish multiple times', (done) => {
        pipeInTestDB('SELECT * FROM users','users2',(err) => {
            assert.ok(!err,'did fail with error ' + (err?err.message:''))
            pipeInTestDB('SELECT * FROM users','users2',(err) => {
                assert.ok(!err,'did fail with error ' + (err?err.message:''))
                pipeInTestDB('SELECT * FROM users','users2',(err) => {
                  assert.ok(!err,'did fail with error ' + (err?err.message:''))
                  checkTableEquality('users','users2',done)
                })
            })
        })
    })

    it('should pipe cars -> anothercars and finish', (done) => {
        pipeInTestDB('SELECT name as name2, brand as branding FROM cars','anothercars',(err) => {
          assert.ok(!err,'did fail with error ' + (err?err.message:''))
          checkTableEquality('cars','anothercars',done)
        })
    })
})
