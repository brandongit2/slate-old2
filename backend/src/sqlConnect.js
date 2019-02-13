const mysql = require('promise-mysql');

const mysqlCreds = require('../mysqlCreds.json');

exports.pool = mysql.createPool({
    connectionLimit: 10,
    user:            mysqlCreds.user,
    password:        mysqlCreds.pass,
    host:            mysqlCreds.host,
    database:        'slate'
});
