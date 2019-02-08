import express from 'express';
import mysql from 'promise-mysql';

import * as mysqlCreds from '../../mysqlCreds.json';

const app = express();
const pool = mysql.createPool({
    connectionLimit: 10,
    user:            mysqlCreds.user,
    password:        mysqlCreds.pass,
    host:            mysqlCreds.host,
    database:        'slate'
});
const apiUrl = '/api';
const port = 3001;

app.get('/', (req, res) => {
    res.end('Slate API root');
});

app.get(apiUrl, (req, res) => {
    res.end('Slate API');
});

// <URL>/api/subjects
app.get(apiUrl + '/subjects', async (req, srvRes) => {
    let subjects = await pool.query(`
        SELECT
            subjects.id,
            subjects.name,
            subjects.description,
            subjects.color,
            GROUP_CONCAT(courses.id) AS courses
        FROM subjects
        LEFT JOIN courses ON courses.subject_id=subjects.id
        GROUP BY subjects.id
    `);

    for (let subject of subjects) {
        subject.courses = JSON.parse('[' + (subject.courses || '') + ']');
    }

    let subjectsObj = {};
    subjects.map(subject => {
        // Remove the `id` key from `subject`
        let newSubject = {};
        Object.entries(subject).slice(1).map(entry => newSubject[entry[0]] = entry[1]);
        subjectsObj[subject.id] = newSubject;
    });

    srvRes.json(subjectsObj);
});

// <URL>/api/subjects/<subject_id>
app.get(apiUrl + '/subjects/:id', async (req, srvRes) => {
    let subjects = await pool.query(`
        SELECT
            subjects.id,
            subjects.name,
            subjects.description,
            subjects.color,
            GROUP_CONCAT(courses.id) AS courses
        FROM subjects
        LEFT JOIN courses ON courses.subject_id=subjects.id
        WHERE subjects.id=${req.params.id}
    `);

    for (let subject of subjects) {
        subject.courses = JSON.parse('[' + (subject.courses || '') + ']');
    }

    let subjectsObj = {};
    subjects.map(subject => {
        // Remove the `id` key from `subject`
        let newSubject = {};
        Object.entries(subject).slice(1).map(entry => newSubject[entry[0]] = entry[1]);
        subjectsObj[subject.id] = newSubject;
    });

    srvRes.json(subjectsObj);
});

// <URL>/api/courses[?subject=<subject_id>]
app.get(apiUrl + '/courses', async (req, srvRes) => {
    let query;
    if (req.query.subject) { // Select all courses within a subject
        query = `
            SELECT
                courses.id,
                courses.order,
                courses.name,
                courses.description,
                GROUP_CONCAT(units.id) AS units
            FROM courses
            LEFT JOIN units ON units.course_id=courses.id
            WHERE courses.subject_id=${req.query.subject}
            GROUP BY courses.id
        `;
    } else { // Select all courses
        query = `
            SELECT
                courses.id,
                courses.order,
                courses.name,
                courses.description,
                GROUP_CONCAT(units.id) AS units
            FROM courses
            LEFT JOIN units ON units.course_id=courses.id
            GROUP BY courses.id
        `;
    }

    let courses = await pool.query(query);

    for (let course of courses) {
        course.units = JSON.parse('[' + (course.units || '') + ']');
    }

    let coursesObj = {};
    courses.map(course => {
        // Remove the `id` key from `course`
        let newCourse = {};
        Object.entries(course).slice(1).map(entry => newCourse[entry[0]] = entry[1]);
        coursesObj[course.id] = newCourse;
    });

    srvRes.json(coursesObj);
});

// <URL>/api/courses/<course_id>
app.get(apiUrl + '/courses/:id', async (req, srvRes) => {
    let courses = await pool.query(`
        SELECT
            courses.id,
            courses.order,
            courses.name,
            courses.description,
            GROUP_CONCAT(units.id) AS units
        FROM courses
        LEFT JOIN units ON units.course_id=courses.id
        WHERE courses.id=${req.params.id}
    `);

    for (let course of courses) {
        course.units = JSON.parse('[' + (course.units || '') + ']');
    }

    let coursesObj = {};
    courses.map(course => {
        // Remove the `id` key from `course`
        let newCourse = {};
        Object.entries(course).slice(1).map(entry => newCourse[entry[0]] = entry[1]);
        coursesObj[course.id] = newCourse;
    });

    srvRes.json(coursesObj);
});

// <URL>/api/units[?course=<course_id> | ?subject=<subject_id>]
app.get(apiUrl + '/units', async (req, srvRes) => {
    let query;
    if (req.query.course) { // Select all units within a course
        query = `
            SELECT
                units.id,
                units.order,
                units.name,
                units.description,
                GROUP_CONCAT(articles.id) AS articles
            FROM units
            LEFT JOIN articles ON units.id=articles.unit_id
            LEFT JOIN courses ON courses.id=units.course_id
            WHERE courses.id=${req.query.course}
            GROUP BY units.id
        `;
    } else if (req.query.subject) { // Select all units within a subject
        query = `
            SELECT
                units.id,
                units.order,
                units.name,
                units.description,
                GROUP_CONCAT(articles.id) AS articles
            FROM units
            LEFT JOIN articles ON units.id=articles.unit_id
            LEFT JOIN courses ON courses.id=units.course_id
            LEFT JOIN subjects ON subjects.id=courses.subject_id
            WHERE subjects.id=${req.query.subject}
            GROUP BY units.id
        `;
    } else { // Select all units
        query = `
            SELECT
                units.id,
                units.order,
                units.name,
                units.description,
                GROUP_CONCAT(articles.id) AS articles
            FROM units
            LEFT JOIN articles ON units.id=articles.unit_id
            GROUP BY units.id
        `;
    }
    let units = await pool.query(query);

    for (let unit of units) {
        unit.articles = JSON.parse('[' + (unit.articles || '') + ']');
    }

    let unitsObj = {};
    units.map(unit => {
        // Remove the `id` key from `unit`
        let newUnit = {};
        Object.entries(unit).slice(1).map(entry => newUnit[entry[0]] = entry[1]);
        unitsObj[unit.id] = newUnit;
    });

    srvRes.json(unitsObj);
});

// <URL>/api/articles[?unit=<unit_id> | ?course=<course_id> | ?subject=<subject_id>]
app.get(apiUrl + '/articles', async (req, srvRes) => {
    let query;
    if (req.query.unit) { // Get all articles within a unit
        query = `
            SELECT
                articles.id,
                articles.order,
                articles.title,
                articles.publish_date AS publishDate,
                articles.update_date AS updateDate,
                articles.content
            FROM articles
            LEFT JOIN units ON articles.unit_id=units.id
            WHERE units.id=${req.query.unit}
        `;
    } else if (req.query.course) { // Get all articles within a course
        query = `
            SELECT
                articles.id,
                articles.order,
                articles.title,
                articles.publish_date AS publishDate,
                articles.update_date AS updateDate,
                articles.content
            FROM articles
            LEFT JOIN units ON articles.unit_id=units.id
            LEFT JOIN courses ON units.course_id=courses.id
            WHERE courses.id=${req.query.course}
        `;
    } else if (req.query.subject) { // Get all articles within a subject
        query = `
            SELECT
                articles.id,
                articles.order,
                articles.title,
                articles.publish_date AS publishDate,
                articles.update_date AS updateDate,
                articles.content
            FROM articles
            LEFT JOIN units ON articles.unit_id=units.id
            LEFT JOIN courses ON units.course_id=courses.id
            LEFT JOIN subjects ON courses.subject_id=subjects.id
            WHERE subjects.id=${req.query.subject}
        `;
    } else { // Get all articles
        query = `
            SELECT
                id,
                order,
                title,
                publish_date AS publishDate,
                update_date AS updateDate,
                content
            FROM articles
        `;
    }

    let articles = await pool.query(query);

    let articlesObj = {};
    articles.map(article => {
        // Remove the `id` key from `article`
        let newArticle = {};
        Object.entries(article).slice(1).map(entry => newArticle[entry[0]] = entry[1]);
        articlesObj[article.id] = newArticle;
    });

    srvRes.json(articlesObj);
});

app.listen(port, () => console.log(`Slate backend running on port ${port}.`));
