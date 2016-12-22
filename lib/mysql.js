'use strict'

const assert = require('assert')
const mysql = require('mysql')
const SQLWriteStream = require('./SQLWriteStream')

exports.createReadStream = (options) => {
  assert.ok(options.connectionUrl,'options.connectionUrl is required attribute')
  assert.ok(options.sql,'options.sql is required attribute')
  let connection = mysql.createConnection(options.connectionUrl)
  return connection.query(options.sql).stream(options)
}

class MySQLWriteStream extends SQLWriteStream {
  insertObjects(objects, callback) {
    let keys = []
    let columns = []
    for (let i in objects[0]) {
      keys.push(i + " = VALUES(" + i + ")")
      columns.push(i)
    }

    let values = []
    objects.forEach((object) => {
      let objectValues = []
      columns.forEach((column) => {
        let value = object[column]
        if (value.substring && value.substring(0, 2) === "`(") {
          value = value.replace(/^`\(/g, "(").replace(/\)`$/g, ")")
        } else {
          value = mysql.escape(value)
        }
        objectValues.push(value)
      })
      values.push(objectValues)
    })

    let sql = "INSERT INTO " + mysql.escapeId(this.table) + " (" + columns.join(",") + ") VALUES "

    sql += values.map((value) => '('+value.join(',')+')').join(',')

    sql += " ON DUPLICATE KEY UPDATE " + keys.join(",")
    // console.log(sql)
    this.connection.query(sql,callback)
  }
}

exports.createWriteStream = (options) => {
  return new MySQLWriteStream(options)
}