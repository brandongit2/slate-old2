import mysql from 'mysql';

import * as mysqlCreds from './mysqlCreds.json';

let pool = mysql.createPool({
    connectionLimit: 10,
    user:            mysqlCreds.user,
    password:        mysqlCreds.pass,
    host:            mysqlCreds.host,
    database:        'slate'
});

pool.query('SELECT * FROM courses;', (err, res) => {
    if (err) throw err;

    console.log(res);
});
