'use strict'

const fs = require('fs')
const mysql = require('mysql')
const Promise = require('bluebird')

exports.prepare = () => {
  let connection = Promise.promisifyAll(mysql.createConnection('mysql://root:test@localhost/test?multipleStatements=1'))

  let sql = fs.readFileSync(__dirname + '/fixtures.sql','utf-8')
  return connection.queryAsync(sql).then(() => {
    let values = []

    for (let i = 0; i < 10000; i++) {
      values.push(`('user_${i}','firstname_${i}','lastname_${i}','1980-01-01' + INTERVAL ${i} DAY)`)
    }

    let insert = 'INSERT INTO `users` (`username`,`firstname`,`lastname`,`birthdate`) VALUES ' + values.join(',')
    return connection.queryAsync(insert)
  })
}

