const express = require('express');

const data = require('./data.js');
const users = require('./users.js');
const {wrap} = require('./utils.js');

const app = express();
const apiUrl = '/api';
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

////////////////////////////////////////////////// DATA FUNCTIONS ////////////////////////////////////////////////////////

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

////////////////////////////////////////////////// USER FUNCTIONS ////////////////////////////////////////////////////////

app.post(apiUrl + '/addUser', wrap(users.addUser));

/////////////////////////////////////////////////// MISCELLANEOUS ////////////////////////////////////////////////////////

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

app.listen(port, () => console.log(`Slate backend running on port ${port}.`));
