const axios = require('axios');
const express = require('express');
const next = require('next');

const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
    dir: './src'
});
const handle = nextApp.getRequestHandler();

const port = 3000;
const url = 'http://localhost';

nextApp.prepare()
    .then(() => {
        const app = express();

        app.get('/subject/:subject', async (req, res) => {
            const actualPage = '/subject';
            try {
                const queryParams = {
                    subject: (await axios.get(url + '/api/subject/' + req.params.subject)).data[0].id
                };
                nextApp.render(req, res, actualPage, queryParams);
            } catch {
                nextApp.render(req, res, '/404');
            }
        });

        app.get('/subject/:subject/:course', async (req, res) => {
            const actualPage = '/course';
            try {
                const subjectId = (await axios.get(url + '/api/subject/' + req.params.subject)).data[0].id;
                const courseId = (await axios.get(url + '/api/course/' + req.params.course)).data[0].id;

                const queryParams = {subject: subjectId, course: courseId};
                nextApp.render(req, res, actualPage, queryParams);
            } catch {
                nextApp.render(req, res, '/404');
            }
        });
        
        app.get('/subject/:subject/:course/:article', async (req, res) => {
            const actualPage = '/article';
            try {
                const subjectId = (await axios.get(url + '/api/subject/' + req.params.subject)).data[0].id;
                const courseId = (await axios.get(url + '/api/course/' + req.params.course)).data[0].id;
                const unitId = (await axios.get(url + '/api/parent?article=' + req.params.article)).data[0].id;

                const queryParams = {
                    subject: subjectId,
                    course:  courseId,
                    unit:    unitId,
                    article: req.params.article
                };
                nextApp.render(req, res, actualPage, queryParams);
            } catch (err) {
                console.error(err);
                nextApp.render(req, res, '/404');
            }
        });

        app.get('/verify', async (req, res) => {
            if (req.query.success === 'true') {
                nextApp.render(req, res, '/verify', {success: 'true'});
            } else if (req.query.success === 'false') {
                nextApp.render(req, res, '/verify', {success: 'false'});
            } else {
                try {
                    const success = (await axios.post(url + '/api/verify', {query: req.query.q})).data.success;
                    if (success) {
                        nextApp.render(req, res, '/verify', {success: 'true'});
                    } else {
                        nextApp.render(req, res, '/verify', {success: 'false'});
                    }
                } catch (err) {
                    console.error(err);
                    res.set('location', url + '/subjects');
                    res.status(301).send();
                }
            }
        });
        
        app.get('/deactivate', async (req, res) => {
            try {
                if (!req.query.q) {
                    res.set('location', url + '/subjects');
                    res.status(301).send();
                }
                axios.post(url + '/api/deactivate', {query: req.query.q});
                nextApp.render(req, res, '/deactivate');
            } catch (err) {
                console.error(err);
                res.set('location', url + '/subjects');
                res.status(301).send();
            }
        });

        app.get('*', (req, res) => {
            return handle(req, res);
        });

        app.listen(port, err => {
            if (err) throw err;
            console.info(`Slate frontend running on port ${port}.`);
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });
