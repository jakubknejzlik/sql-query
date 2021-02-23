"use strict";

const mysql = require("mysql");
const Promise = require("bluebird");

class MySQLConnection {
  constructor(connectionUrl) {
    if (connectionUrl.indexOf("?") === -1) {
      connectionUrl += "?multipleStatements=true";
    } else {
      connectionUrl += "&multipleStatements=true";
    }
    this.connectionUrl = connectionUrl;
  }

  query(sql) {
    let connection = Promise.promisifyAll(
      mysql.createConnection(this.connectionUrl)
    );

    return connection
      .queryAsync({ sql, timeout: process.env.QUERY_TIMEOUT || 1000 * 60 * 30 })
      .finally(() => {
        connection.end();
      });
  }
}

module.exports = MySQLConnection;
