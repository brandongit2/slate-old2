// For retrieving data such as subjects, courses, units, and articles.

const {pool} = require('./sqlConnect.js');

exports.getSubjectId = async (req, res) => {
    if (req.query.course) {
        const data = await pool.query(`SELECT subject_id AS id FROM courses WHERE name=?`, [req.query.course]);
        if (data.length === 1) {
            res.json(data[0]);
        } else {
            res.end('Course doesn\' exist.');
        }
    } else if (req.query.name) {
        const data = await pool.query(`SELECT id FROM subjects WHERE name=?`, [req.query.name]);
        if (data.length === 1) {
            res.json(data[0]);
        } else {
            res.end('Course doesn\'t exist.');
        }
    } else {
        res.end('Invalid query.');
    }
};

exports.getCourseIdByCourseName = async (req, res) => {
    const data = await pool.query(`SELECT id FROM courses WHERE name=?`, [req.query.name]);
    if (data.length === 1) {
        res.json(data[0]);
    } else {
        res.end('Course doesn\'t exist.');
    }
};

exports.getAllSubjects = async (req, srvRes) => {
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
        subjectsObj[subject.id] = subject;
        delete subject.id;
    });

    srvRes.json(subjectsObj);
};

exports.getSubjectById = async (req, srvRes) => {
    let subjects = await pool.query(`
        SELECT
            subjects.id,
            subjects.name,
            subjects.description,
            subjects.color,
            GROUP_CONCAT(courses.id) AS courses
        FROM subjects
        LEFT JOIN courses ON courses.subject_id=subjects.id
        WHERE subjects.id=?
    `, [req.params.id]);

    for (let subject of subjects) {
        subject.courses = JSON.parse('[' + (subject.courses || '') + ']');
    }

    let subjectsObj = {};
    subjects.map(subject => {
        // Remove the `id` key from `subject`
        subjectsObj[subject.id] = subject;
        delete subject.id;
    });

    srvRes.json(subjectsObj);
};

exports.getCourses = async (req, srvRes) => {
    let courses;
    if (req.query.subject) { // Select all courses within a subject
        courses = await pool.query(`
            SELECT
                courses.id,
                courses.order,
                courses.name,
                courses.description,
                GROUP_CONCAT(units.id) AS units
            FROM courses
            LEFT JOIN units ON units.course_id=courses.id
            WHERE courses.subject_id=?
            GROUP BY courses.id
        `, [req.query.subject]);
    } else { // Select all courses
        courses = await pool.query(`
            SELECT
                courses.id,
                courses.order,
                courses.name,
                courses.description,
                GROUP_CONCAT(units.id) AS units
            FROM courses
            LEFT JOIN units ON units.course_id=courses.id
            GROUP BY courses.id
        `);
    }

    for (let course of courses) {
        course.units = JSON.parse('[' + (course.units || '') + ']');
    }

    let coursesObj = {};
    courses.map(course => {
        // Remove the `id` key from `course`
        coursesObj[course.id] = course;
        delete course.id;
    });

    srvRes.json(coursesObj);
};

exports.getCourseById = async (req, srvRes) => {
    let courses = await pool.query(`
        SELECT
            courses.id,
            courses.order,
            courses.name,
            courses.description,
            GROUP_CONCAT(units.id) AS units
        FROM courses
        LEFT JOIN units ON units.course_id=courses.id
        WHERE courses.id=?
    `, [req.params.id]);

    for (let course of courses) {
        course.units = JSON.parse('[' + (course.units || '') + ']');
    }

    let coursesObj = {};
    courses.map(course => {
        // Remove the `id` key from `course`
        coursesObj[course.id] = course;
        delete course.id;
    });

    srvRes.json(coursesObj);
};

exports.getUnits = async (req, srvRes) => {
    let units;
    if (req.query.course) { // Select all units within a course
        units = await pool.query(`
            SELECT
                units.id,
                units.order,
                units.name,
                units.description,
                GROUP_CONCAT(articles.id) AS articles
            FROM units
            LEFT JOIN articles ON units.id=articles.unit_id
            LEFT JOIN courses ON courses.id=units.course_id
            WHERE courses.id=?
            GROUP BY units.id
        `, [req.query.course]);
    } else if (req.query.subject) { // Select all units within a subject
        units = await pool.query(`
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
            WHERE subjects.id=?
            GROUP BY units.id
        `, [req.query.subject]);
    } else { // Select all units
        units = await pool.query(`
            SELECT
                units.id,
                units.order,
                units.name,
                units.description,
                GROUP_CONCAT(articles.id) AS articles
            FROM units
            LEFT JOIN articles ON units.id=articles.unit_id
            GROUP BY units.id
        `);
    }

    for (let unit of units) {
        unit.articles = JSON.parse('[' + (unit.articles || '') + ']');
    }

    let unitsObj = {};
    units.map(unit => {
        unitsObj[unit.id] = unit;
        delete unit.id;
    });

    srvRes.json(unitsObj);
};

exports.getArticles = async (req, srvRes) => {
    let articles;
    if (req.query.unit) { // Get all articles within a unit
        articles = await pool.query(`
            SELECT
                articles.id,
                articles.order,
                articles.title,
                articles.publish_date AS publishDate,
                articles.update_date AS updateDate,
                articles.content
            FROM articles
            LEFT JOIN units ON articles.unit_id=units.id
            WHERE units.id=?
        `, [req.query.unit]);
    } else if (req.query.course) { // Get all articles within a course
        articles = await pool.query(`
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
            WHERE courses.id=?
        `, [req.query.course]);
    } else if (req.query.subject) { // Get all articles within a subject
        articles = await pool.query(`
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
            WHERE subjects.id=?
        `, [req.query.subject]);
    } else { // Get all articles
        articles = await pool.query(`
            SELECT
                id,
                order,
                title,
                publish_date AS publishDate,
                update_date AS updateDate,
                content
            FROM articles
        `);
    }

    let articlesObj = {};
    articles.map(article => {
        articlesObj[article.id] = article;
        delete article.id;
    });

    srvRes.json(articlesObj);
};