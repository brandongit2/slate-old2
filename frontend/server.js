const axios = require('axios');
const cookieParser = require('cookie-parser');
const express = require('express');
const next = require('next');

const {rootUrl, verboseErrors} = require('./config.json');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const handle = nextApp.getRequestHandler();
const port = 3000;

axios.defaults.baseURL = rootUrl;

nextApp.prepare()
    .then(() => {
        const app = express();

        app.use(cookieParser());

        /////////////////////////// CONTENT PAGES //////////////////////////////

        app.get('/subject/:subject', async (req, res) => {
            const actualPage = '/subject';
            try {
                const queryParams = {
                    subject: (await axios.get('/api/subject/' + req.params.subject)).data[0].id
                };
                nextApp.render(req, res, actualPage, queryParams);
            } catch (err) {
                if (verboseErrors) console.error(err);
                console.trace();

                nextApp.render(req, res, '/404');
            }
        });

        app.get('/subject/:subject/:course', async (req, res) => {
            const actualPage = '/course';
            try {
                const subjectId = (await axios.get('/api/subject/' + req.params.subject)).data[0].id;
                const courseId = (await axios.get('/api/course/' + req.params.course)).data[0].id;

                const queryParams = {subject: subjectId, course: courseId};
                nextApp.render(req, res, actualPage, queryParams);
            } catch (err) {
                if (verboseErrors) console.error(err);
                console.trace();

                nextApp.render(req, res, '/404');
            }
        });

        app.get('/subject/:subject/:course/:article', async (req, res) => {
            const actualPage = '/article';
            try {
                const subjectId = (await axios.get('/api/subject/' + req.params.subject)).data[0].id;
                const courseId = (await axios.get('/api/course/' + req.params.course)).data[0].id;
                const unitId = (await axios.get('/api/parent?article=' + req.params.article)).data[0].id;
                const articleId = (await axios.get('/api/article/' + req.params.article)).data[0].id;

                const queryParams = {
                    subject: subjectId,
                    course:  courseId,
                    unit:    unitId,
                    article: articleId
                };
                nextApp.render(req, res, actualPage, queryParams);
            } catch (err) {
                if (verboseErrors) console.error(err);
                console.trace();

                nextApp.render(req, res, '/404');
            }
        });

        ////////////////////////////// ADMIN PAGE //////////////////////////////

        app.get('/admin/:page', (req, res) => {
            nextApp.render(req, res, '/admin', {...req.query, page: req.params.page});
        });

        //////////////////////////// MISCELLANEOUS /////////////////////////////

        app.get('/component-tests/:test', (req, res) => {
            nextApp.render(req, res, '/component-tests', {test: req.params.test});
        });

        app.get('/change-password', async (req, res) => {
            nextApp.render(req, res, '/change-password', {query: req.query.q});
        });

        app.get('/verify', async (req, res) => {
            if (req.query.success === 'true') {
                nextApp.render(req, res, '/verify', {success: 'true'});
            } else if (req.query.success === 'false') {
                nextApp.render(req, res, '/verify', {success: 'false'});
            } else {
                try {
                    const success = (await axios.post('/api/verify', {query: req.query.q})).data.success;
                    if (success) {
                        nextApp.render(req, res, '/verify', {success: 'true'});
                    } else {
                        nextApp.render(req, res, '/verify', {success: 'false'});
                    }
                } catch (err) {
                    if (verboseErrors) console.error(err);
                    console.trace();

                    res.set('location', rootUrl);
                    res.status(301).send();
                }
            }
        });

        app.get('/deactivate', async (req, res) => {
            try {
                if (!req.query.q) {
                    res.set('location', rootUrl);
                    res.status(301).send();
                }
                nextApp.render(req, res, '/deactivate', {query: req.query.q});
            } catch (err) {
                if (verboseErrors) console.error(err);
                console.trace();

                res.set('location', rootUrl);
                res.status(301).send();
            }
        });

        app.get('*', (req, res) => {
            return handle(req, res);
        });

        app.listen(port, err => {
            if (err) {
                if (verboseErrors) console.error(err);
                console.trace();
            }

            console.info(`Slate frontend running on port ${port}.`);
        });
    })
    .catch(err => {
        if (verboseErrors) console.error(err);
        console.trace();
    });
