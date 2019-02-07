const express = require('express');
const mysql = require('promise-mysql');
const next = require('next');

const mysqlCreds = require('../mysqlCreds.json');

const app = next({
    dev: process.env.NODE_ENV !== 'production',
    dir: './src'
});
const handle = app.getRequestHandler();

const pool = mysql.createPool({
    connectionLimit: 10,
    user:            mysqlCreds.user,
    password:        mysqlCreds.pass,
    host:            mysqlCreds.host,
    database:        'slate'
});

app.prepare()
    .then(() => {
        const server = express();

        server.get('/subject/:subject', async (req, res) => {
            const actualPage = '/subject';
            const subjectId = (await pool.query(`SELECT id FROM subjects WHERE name='${req.params.subject}'`))[0].id;

            const queryParams = {subject: subjectId};
            app.render(req, res, actualPage, queryParams);
        });

        server.get('/subject/*/:course', async (req, res) => {
            const actualPage = '/course';
            const courseId = (await pool.query(`SELECT id FROM courses WHERE name='${req.params.course}'`))[0].id;

            const queryParams = {course: courseId};
            app.render(req, res, actualPage, queryParams);
        });

        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.listen(3000, err => {
            if (err) throw err;
            console.log('> Ready on http://localhost:3000');
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });
