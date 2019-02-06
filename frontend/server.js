const express = require('express');
const next = require('next');

const app = next({
    dev: process.env.NODE_ENV !== 'production',
    dir: './src'
});
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = express();

        server.get('/subject/:subject', (req, res) => {
            const actualPage = '/subject';
            const queryParams = {subject: req.params.subject};
            app.render(req, res, actualPage, queryParams);
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
