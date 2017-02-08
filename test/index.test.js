'use strict'

const assert = require('assert')
const mysql = require('mysql')

const mysqlStreams = require('../lib/mysql')
const mssqlStreams = require('../lib/mssql')
const handler = require('../index').handler

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
    let sql = `SELECT [type]
    ,concat(id,date) as eid
    ,[number]
    ,[invoice_address_name]
    ,[invoice_address_street]
    ,[invoice_address_zip]
    ,[invoice_address_city]
    ,[delivery_address_name]
    ,[delivery_address_street]
    ,[delivery_address_zip]
    ,[delivery_address_city]
    ,[in_id]
    ,[tin]
    ,[customer_id]
    ,[order_number]
    ,[delivery_note]
    ,[price_vat1]
    ,[price_vat2]
    ,[price_vat3]
    ,[price_vat4]
    ,[vat1]
    ,[vat2]
    ,[vat3]
    ,[vat4]
    ,[price_czk]
    ,[price_paid_czk]
    ,[price_foreign]
    ,[price_paid_foreign]
    ,[currency]
    ,[rate]
    ,[date]
    ,[tax_date]
    ,[paid_date]
    ,[maturity_date]
    ,[after_maturity_date]
    ,[account]
    ,101 as company_id
    FROM [db19465_fenix].[db19465_fenix].[Invoice]
    where type like 'F%'`
    handler({
      sourceConnection: 'mssql://db19465_fenix:heliosifsystem@mssql15.profiwh.com/db19465_fenix',
      sourceSQL: sql,
      destinationConnection: 'mysql://fenix:7TL4PnhTqezKteSv@db.novato.cz/fenix_holding',
      destinationTable: 'invoice2'
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