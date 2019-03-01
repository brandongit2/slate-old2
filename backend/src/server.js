const express = require('express');

const data = require('./data.js');
const users = require('./users.js');
const {wrap} = require('./utils.js');
const auth = require('./auth.js');

const app = express();
const apiUrl = '/api';
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.enable('trust proxy');

app.use(auth.auth);

////////////////////////////////////////////////// DATA FUNCTIONS //////////////////////////////////////////////////////

// Lists only get id and name, whereas the other endpoints get detailed information for a specific item.

app.get(apiUrl + '/allSubjects', wrap(data.getAllSubjects));
app.get(apiUrl + '/subject/:id', wrap(data.getSubject));

app.get(apiUrl + '/allCourses', wrap(data.getAllCourses));
app.get(apiUrl + '/course/:id', wrap(data.getCourse));

app.get(apiUrl + '/allUnits', wrap(data.getAllUnits));
app.get(apiUrl + '/unit/:id', wrap(data.getUnit));

app.get(apiUrl + '/allArticles', wrap(data.getAllArticles));
app.get(apiUrl + '/article/:id', wrap(data.getArticle));

// <apiUrl>/parent?[want=<subject|course|unit>&]<course|unit|article>=<name|id>
// ex: <apiUrl>/parent?want=subject&article=2 gets the subject containing article #2
app.get(apiUrl + '/parent', wrap(data.getParent));

// <apiUrl>/children?<subject|course|unit>=<name|id>
app.get(apiUrl + '/children', wrap(data.getChildren));

////////////////////////////////////////////////// USER FUNCTIONS //////////////////////////////////////////////////////

app.post(apiUrl + '/add-user', wrap(users.addUser));
app.post(apiUrl + '/authenticate', wrap(users.authenticate));
app.post(apiUrl + '/deactivate', wrap(users.deactivate));
app.post(apiUrl + '/resend-verification-email', wrap(users.resendEmail));

// <URL>/api/verify?e=<unique query string>
app.post(apiUrl + '/verify', wrap(users.verifyEmail));

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
    console.error(err);
});

app.listen(port, () => console.info(`Slate backend running on port ${port}.`));
