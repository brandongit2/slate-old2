const request = require('supertest');

const app = require('../server');

describe('Slate API', () => {
    describe('/api', () => {
        test('should return 200', done => {
            request(app.app).get('/api').expect(200, done);
        });
    });
    
    describe('/nonexistentpage', () => {
        test('should return 404', done => {
            request(app.app).get('/nonexistentpage').expect(404, done);
        });
    });
    
    describe('/api/log-in', () => {
        test('should return 200', done => {
            request(app.app).post('/api/log-in').expect(200, done);
        });
    });
    describe('/api/log-out', () => {
        test('should return 200', done => {
            request(app.app).post('/api/log-out').expect(200, done);
        });
    });
    describe('/api/reset-password', () => {
        test('should return 200', done => {
            request(app.app).post('/api/reset-password').expect(200, done);
        });
    });
    describe('/api/add-user', () => {
        test('should return 200', done => {
            request(app.app).post('/api/add-user').expect(200, done);
        });
    });
    describe('/api/authenticate', () => {
        test('should return 200', done => {
            request(app.app).post('/api/authenticate').expect(200, done);
        });
    });
    describe('/api/deactivate', () => {
        test('should return 200', done => {
            request(app.app).post('/api/deactivate').expect(200, done);
        });
    });
    describe('/resend-verification-email', () => {
        test('should return 200', done => { request(app.app).post('/resend-verification-email').expect(200, done); });
    });
});

afterAll(() => {
    app.server.close();
});
