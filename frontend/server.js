const axios = require('axios');
const express = require('express');
const next = require('next');

const app = next({
    dev: process.env.NODE_ENV !== 'production',
    dir: './src'
});
const handle = app.getRequestHandler();

const apiPrefix = 'http://localhost:8080';

app.prepare()
    .then(() => {
        const server = express();

        server.get('/subject/:subject/:course', async (req, res) => {
            const actualPage = '/course';
            try {
                const subjectId = (await axios.get(apiPrefix + '/api/subjectId?course=' + req.params.course)).data.id;
                const courseId = (await axios.get(apiPrefix + '/api/courseId?name=' + req.params.course)).data.id;

                const queryParams = {subject: subjectId, course: courseId};
                app.render(req, res, actualPage, queryParams);
            } catch {
                app.render(req, res, '/404');
            }
        });

        server.get('/subject/:subject', async (req, res) => {
            const actualPage = '/subject';
            try {
                const subjectId = (await axios.get(apiPrefix + '/api/subjectId?name=' + req.params.subject)).data.id;

                const queryParams = {subject: subjectId};
                app.render(req, res, actualPage, queryParams);
            } catch {
                app.render(req, res, '/404');
            }
        });

        server.get('/verify', async (req, res) => {
            try {
                const success = (await axios.get(apiPrefix + '/api/verify?e=' + req.query.e)).data.success;
                if (success) {
                    app.render(req, res, '/verify');
                } else {
                    app.render(req, res, '/404');
                }
            } catch {
                app.render(req, res, '/404');
            }
        });

        server.get('*', (req, res) => {
            return handle(req, res);
        });

        server.listen(3000, err => {
            if (err) throw err;
            console.log('> Ready on http://localhost:3000');
        });
    })
    .catch(ex => {
        console.error(ex.stack);
        process.exit(1);
    });
