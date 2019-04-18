const asyncHandler = require('express-async-handler');
const cookieParser = require('cookie-parser');
const express = require('express');

const data = require('./data');
const settings = require('./settings');
const user = require('./user');
const util = require('./util');

const {port} = require('./config.json');

const app = express();
const apiUrl = '/api';

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.enable('trust proxy');

app.use(util.auth);

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

// <apiUrl>/children?[want=<courses|units|articles>&]<subject|course|unit>=<name|id>
// example: <apiUrl>/children?want=articles&course=1 gets all articles belonging to course #1
app.get(apiUrl + '/children', asyncHandler(data.getChildren));

////////////////////////////////////////////////// USER FUNCTIONS //////////////////////////////////////////////////////

app.post(apiUrl + '/add-user', asyncHandler(user.addUser));
app.post(apiUrl + '/authenticate', user.authenticate);
app.post(apiUrl + '/deactivate', asyncHandler(user.deactivate));
app.post(apiUrl + '/log-in', asyncHandler(user.logIn));
app.post(apiUrl + '/log-out', user.logOut);
app.post(apiUrl + '/reset-password', user.resetPassword);
app.post(apiUrl + '/change-password', user.changePassword);
app.post(apiUrl + '/resend-verification-email', asyncHandler(user.resendEmail));

// <URL>/api/verify?e=<unique query string>
app.post(apiUrl + '/verify', asyncHandler(user.verifyEmail));

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
