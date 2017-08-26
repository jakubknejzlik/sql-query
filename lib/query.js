const assert = require("assert");
const url = require("url");

const connections = {
  mssql: require("./mssql"),
  mysql: require("./mysql")
};

module.exports = function transfer(event) {
  let connectionURL = event.connectionUrl;
  let sql = event.sql;

  let _connectionURL = url.parse(connectionURL);

  let Connection = connections[_connectionURL.protocol.replace(":", "")];

  if (!Connection)
    return callback(new Error("connection protocol not supported"));

  let connection = new Connection(connectionURL);
  return connection.query(sql);
};
