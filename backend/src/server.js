const express = require('express');
const https = require('https');

const data = require('./data.js');
const users = require('./users.js');
const {wrap} = require('./utils.js');
const {credentials} = require('../../certOptions.js');

const app = express();
const apiUrl = '/api';
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.enable('trust proxy');

////////////////////////////////////////////////// DATA FUNCTIONS //////////////////////////////////////////////////////

// <URL>/api/subjectId[?course=<course_name> | ?name=<subject_name>]
app.get(apiUrl + '/subjectId', wrap(data.getSubjectId));

// <URL>/api/courseId?name=<course_name>
app.get(apiUrl + '/courseId', wrap(data.getCourseIdByCourseName));

// <URL>/api/subjects
app.get(apiUrl + '/subjects', wrap(data.getAllSubjects));

// <URL>/api/subjects/<subject_id>
app.get(apiUrl + '/subjects/:id', wrap(data.getSubjectById));

// <URL>/api/courses[?subject=<subject_id>]
app.get(apiUrl + '/courses', wrap(data.getCourses));

// <URL>/api/courses/<course_id>
app.get(apiUrl + '/courses/:id', wrap(data.getCourseById));

// <URL>/api/units[?course=<course_id> | ?subject=<subject_id>]
app.get(apiUrl + '/units', wrap(data.getUnits));

// <URL>/api/articles[?unit=<unit_id> | ?course=<course_id> | ?subject=<subject_id>]
app.get(apiUrl + '/articles', wrap(data.getArticles));

////////////////////////////////////////////////// USER FUNCTIONS //////////////////////////////////////////////////////

app.post(apiUrl + '/add-user', wrap(users.addUser));
app.post(apiUrl + '/authenticate', wrap(users.authenticate));
app.post(apiUrl + '/resend-verification-email', wrap(users.resendEmail));

// <URL>/api/verify?e=<unique query string>
app.get(apiUrl + '/verify', wrap(users.verifyEmail));

/////////////////////////////////////////////////// MISCELLANEOUS //////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.end('Slate API root');
});

app.get(apiUrl, (req, res) => {
    res.end('Slate API');
});

app.use((req, res) => {
    res.status(404).end('Not found');
});

app.use((err, req, res) => {
    if (!res.headersSent) {
        res.status(500).end('Internal server error');
    }
    console.log(err);
});

https.createServer(credentials, app).listen(port, () => console.log(`Slate backend running on port ${port}.`));
