const mysql = require('promise-mysql');
const fs = require('fs');

const mysqlCreds = JSON.parse(fs.readFileSync(process.env.TRAVIS ? 'mysqlCreds.test.json' : 'mysqlCreds.json'));

exports.pool = mysql.createPool({
    connectionLimit: 10,
    user:            mysqlCreds.user,
    password:        mysqlCreds.pass,
    host:            mysqlCreds.host,
    database:        mysqlCreds.database
});
