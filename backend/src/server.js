import express from 'express';
import mysql from 'promise-mysql';

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
    res.end('Slate API root');
});

app.get(apiUrl, (req, res) => {
    res.end('Slate API');
});

app.get(apiUrl + '/subjects', async (req, srvRes) => {
    let subjects = await pool.query(`
        SELECT name, description, color FROM subjects ORDER BY id;
    `);
    let courses = await pool.query(`
        SELECT subject, course FROM subjects_to_courses;
    `);

    // Add a key named 'courses' to each subject, containing the IDs of the
    // courses belonging to that subject.
    for (let subject of subjects) {
        subject.courses = [];
    }
    for (let course of courses) {
        subjects[course.subject - 1].courses.push(course.course - 1);
    }

    srvRes.json(subjects);
});

app.get(apiUrl + '/courses', (req, srvRes) => {
    pool.query(`
        SELECT
            name, description
        FROM
            courses
        ORDER BY
            id;
    `).then(sqlRes => {
        srvRes.json(sqlRes);
    }).catch(err => console.log(err));
});

app.listen(3001, () => console.log('Slate backend running on port 3001.'));
