const asyncHandler = require('express-async-handler');
const cookieParser = require('cookie-parser');
const express = require('express');

const auth = require('./auth');
const data = require('./data');
const settings = require('./settings');
const users = require('./users');

const {port} = require('./config.json');

const app = express();
const apiUrl = '/api';

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.enable('trust proxy');

app.use(auth.auth);

////////////////////////////////////////////////// DATA FUNCTIONS //////////////////////////////////////////////////////

app.get(apiUrl + '/allSubjects', asyncHandler(data.getAllSubjects));
app.get(apiUrl + '/subject/:id', asyncHandler(data.getSubject));

app.get(apiUrl + '/allCourses', asyncHandler(data.getAllCourses));
app.get(apiUrl + '/course/:id', asyncHandler(data.getCourse));

app.get(apiUrl + '/allUnits', asyncHandler(data.getAllUnits));
app.get(apiUrl + '/unit/:id', asyncHandler(data.getUnit));

app.get(apiUrl + '/allArticles', asyncHandler(data.getAllArticles));
app.get(apiUrl + '/article/:id', asyncHandler(data.getArticle));
app.get(apiUrl + '/article-content/:id', asyncHandler(data.getArticleContent));

// <apiUrl>/parent?[want=<subject|course|unit>&]<course|unit|article>=<name|id>
// example: <apiUrl>/parent?want=subject&article=2 gets the subject containing article #2
app.get(apiUrl + '/parent', asyncHandler(data.getParent));

// <apiUrl>/children?<subject|course|unit>=<name|id>
app.get(apiUrl + '/children', asyncHandler(data.getChildren));

////////////////////////////////////////////////// USER FUNCTIONS //////////////////////////////////////////////////////

app.post(apiUrl + '/add-user', asyncHandler(users.addUser));
app.post(apiUrl + '/authenticate', auth.authenticate);
app.post(apiUrl + '/deactivate', asyncHandler(users.deactivate));
app.post(apiUrl + '/log-in', asyncHandler(auth.logIn));
app.post(apiUrl + '/log-out', auth.logOut);
app.post(apiUrl + '/reset-password', auth.resetPassword);
app.post(apiUrl + '/resend-verification-email', asyncHandler(users.resendEmail));

// <URL>/api/verify?e=<unique query string>
app.post(apiUrl + '/verify', asyncHandler(users.verifyEmail));

/////////////////////////////////////////////////// USER SETTINGS //////////////////////////////////////////////////////

app.post(apiUrl + '/settings/toggle-theme', settings.toggleTheme);

/////////////////////////////////////////////////// MISCELLANEOUS //////////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.send('Slate API root');
});

app.get(apiUrl, (req, res) => {
    res.send('Slate API');
});

app.use((req, res) => {
    res.status(404).end('404 Not found');
});

app.use((err, req, res) => {
    if (!res.headersSent) {
        res.status(500).end('500 Internal server error');
    }
    console.trace();
});

const server = app.listen(port, () => console.info(`Slate backend running on port ${port}.`));

module.exports = {app, server};
