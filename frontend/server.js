const axios = require('axios');
const express = require('express');
const https = require('https');
const next = require('next');

const {credentials} = require('../certOptions.js');

const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
    dir: './src'
});
const handle = nextApp.getRequestHandler();

const port = 3000;
const url = 'https://localhost';

nextApp.prepare()
    .then(() => {
        const app = express();

        app.get('/subject/:subject', async (req, res) => {
            const actualPage = '/subject';
            try {
                const subjectId = (await axios.get(url + '/api/subjectId?name=' + req.params.subject)).data.id;

                const queryParams = {subject: subjectId};
                nextApp.render(req, res, actualPage, queryParams);
            } catch {
                nextApp.render(req, res, '/404');
            }
        });

        app.get('/subject/:subject/:course', async (req, res) => {
            const actualPage = '/course';
            try {
                const subjectId = (await axios.get(url + '/api/subjectId?course=' + req.params.course)).data.id;
                const courseId = (await axios.get(url + '/api/courseId?name=' + req.params.course)).data.id;

                const queryParams = {subject: subjectId, course: courseId};
                nextApp.render(req, res, actualPage, queryParams);
            } catch {
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

        https.createServer(credentials, app).listen(port, err => {
            if (err) throw err;
            console.log(`Slate frontend running on port ${port}.`);
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });
