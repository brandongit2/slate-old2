const request = require('supertest');
const app = require('../server');

describe('Slate API', () => {
    describe('/api', () => {
        it('should return 200', done => {
            request(app.app).get('/api').expect(200, done);
        });
    });
    describe('/nonexistentpage', () => {
        it('should return 404', done => {
            request(app.app).get('/nonexistentpage').expect(404, done);
        });
    });
    describe('/api/log-in', () => {
        it('should return 200', done => {
            request(app.app).post('/api/log-in').expect(200, done);
        });
    });
});

afterAll(() => {
    app.server.close();
});
