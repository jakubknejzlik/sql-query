"use strict";

const mssql = require("mssql");
const Promise = require("bluebird");

class MSSQLConnection {
  constructor(connectionUrl) {
    this.connectionUrl = connectionUrl;
  }

  query(sql) {
    return new Promise((resolve, reject) => {
      let connection = new mssql.Connection(this.connectionUrl, err => {
        if (err) return reject(err);
        resolve(connection);
      });
    }).then(connection => {
      var request = new sql.Request(connection); // or: var request = connection1.request();
      return request.query(sql).finally(() => {
        connection.close();
      });
    });
  }
}

module.exports = MSSQLConnection;
