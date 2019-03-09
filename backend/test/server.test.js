const request = require('supertest');
const assert = require('chai').assert;

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

    describe('/api/authenticate', () => {
        it('empty body - should return 200 and not succeed', done => {
            request(app.app).post('/api/authenticate').expect(200).end((err, res) => {
                if (err) return done(err);
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });
        it('invalid token - should return 200 and not succeed', done => {
            request(app.app).post('/api/authenticate').set('Cookie', ['authToken=thisshouldfail']).expect(200).end((err, res) => {
                if (err) return done(err);
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });

        it('expired token - should return 200 and not succeed', done => {
            request(app.app).post('/api/authenticate').set('Cookie', ['authToken=9cZ8R3yLIzoFnoCD']).expect(200).end((err, res) => {
                if (err) return done(err);
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });
        it('valid token - should return 200 and succeed', done => {
            request(app.app).post('/api/authenticate').set('Cookie', ['authToken=u6P3AojGYYrywrRQ']).expect(200).end((err, res) => {
                if (err) return done(err);
                assert.deepEqual(res.body, {
                    success: true,
                    user:    {
                        email:          'brandononline2@gmail.com',
                        first_name:     'Brandon',
                        id:             1,
                        last_name:      'Tsang',
                        password_reset: 0,
                        permissions:    5,
                        valid_email:    1,
                        theme:          'light'
                    }
                });
                done();
            });
        });
    });
    describe('/api/log-out', () => {
        it('no token - should return 200 and not succeed', done => {
            request(app.app).post('/api/log-out').expect(200).end((err, res) => {
                assert.equal(res.text, 'You are not logged in.');
                done();
            });
        });

        it('invalid token - should return 200 and not succeed', done => {
            request(app.app).post('/api/log-out').set('Cookie', ['authToken=9cZ8R3yLIzoFnoCD']).expect(200).end((err, res) => {
                assert.equal(res.text, 'You are not logged in.');
                done();
            });
        });

        it('valid token - should return 200 and succeed', done => {
            request(app.app).post('/api/log-out').set('Cookie', ['authToken=u6P3AojGYYrywrRQ']).expect(200).end((err, res) => {
                assert.equal(res.text, '');
                done();
            });
        });

        it('valid token - should return 200 and token should be invalidated', done => {
            request(app.app).post('/api/log-out').set('Cookie', ['authToken=u6P3AojGYYrywrRQ']).expect(200).end((err, res) => {
                request(app.app).post('/api/authenticate').set('Cookie', ['authToken=u6P3AojGYYrywrRQ']).expect(200).end((err, res) => {
                    if (err) return done(err);
                    assert.deepEqual(res.body, {success: false});
                    done();
                });
            });
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
    describe('/api/log-in', () => {
        it('should return 200', done => {
            request(app.app).post('/api/log-in').expect(200, done);
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
