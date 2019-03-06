const request = require('supertest');

const app = require('../src/server');

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
    describe('/api/log-out', () => {
        it('should return 200', done => {
            request(app.app).post('/api/log-out').expect(200, done);
        });
    });
    describe('/api/reset-password', () => {
        it('should return 200', done => {
            request(app.app).post('/api/reset-password').expect(200, done);
        });
    });
    describe('/api/add-user', () => {
        it('should return 200', done => {
            request(app.app).post('/api/add-user').expect(200, done);
        });
    });
    describe('/api/authenticate', () => {
        it('should return 200', done => {
            request(app.app).post('/api/authenticate').expect(200, done);
        });
    });
    describe('/api/deactivate', () => {
        it('should return 200', done => {
            request(app.app).post('/api/deactivate').expect(200, done);
        });
    });
    describe('/resend-verification-email', () => {
        it('should return 200', done => { request(app.app).post('/api/resend-verification-email').expect(200, done); });
    });
});

after('close server', () => {
    app.server.close();
});
