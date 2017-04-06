'use strict'

const assert = require('assert')
const mysql = require('mysql')

const mysqlStreams = require('../lib/mysql')
const mssqlStreams = require('../lib/mssql')
const handler = require('../lib/query')

const fixtures = require('./fixtures')

describe('handler', () => {

    beforeEach(() => {
        return fixtures.prepare()
    })

    it('test', () => {
      let sql = `SELECT
        id,
        username,
        firstname,
        lastname,
        birthdate
        FROM users
      `
      return handler({
        connectionUrl: 'mysql://root:test@localhost/test',
        sql: sql
      }).then((result) => {
        assert.equal(result.length, 1000)
      })
    })
})
