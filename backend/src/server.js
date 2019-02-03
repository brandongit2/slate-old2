import express from 'express';
import mysql from 'mysql';

import * as mysqlCreds from './mysqlCreds.json';

const app = express();
const pool = mysql.createPool({
    connectionLimit: 10,
    user:            mysqlCreds.user,
    password:        mysqlCreds.pass,
    host:            mysqlCreds.host,
    database:        'slate'
});
const apiUrl = '/api';

app.get('/', (req, res) => {
    res.end('wow');
});

app.get(apiUrl, (req, res) => {
    res.end('hi');
});

app.get(apiUrl + '/courses', (req, srvRes) => {
    pool.query('SELECT * from courses;', (err, sqlRes) => {
        if (err) throw err;

        srvRes.json(sqlRes);
    });
});

app.listen(3001, () => console.log('Slate backend running on port 3001.'));
