const request = require('supertest');
const app = require('../server');

describe('Slate API', function() {
    describe('/api', () => {
        it('should return 200', function (done) {
            request(app.app).get('/api').expect(200, done);
        })
    });
    describe('/nonexistentpage', () => {
        it('should return 404', function (done) {
            request(app.app).get('/nonexistentpage').expect(404, done);
        })
    });
    describe('/api/log-in', () => {
        it('should return 200', function (done) {
            request(app.app).get('/api/log-in').expect(200, done);
        })
    });
});

afterAll(() => {
    app.server.close();
})