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
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });
        it('invalid token - should return 200 and not succeed', done => {
            request(app.app).post('/api/authenticate').set('Cookie', ['authToken=thisshouldfail']).expect(200).end((err, res) => {
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });

        it('expired token - should return 200 and not succeed', done => {
            request(app.app).post('/api/authenticate').set('Cookie', ['authToken=9cZ8R3yLIzoFnoCD']).expect(200).end((err, res) => {
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });
        it('valid token - should return 200 and succeed', done => {
            request(app.app).post('/api/authenticate').set('Cookie', ['authToken=u6P3AojGYYrywrRQ']).expect(200).end((err, res) => {
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

        it('valid token - should return 200 and token should be invalidated', done => {
            const agent = request.agent(app.app);
            agent.post('/api/log-out').set('Cookie', ['authToken=u6P3AojGYYrywrRQ']).expect(200).end((err, res) => {
                agent.post('/api/authenticate').set('Cookie', ['authToken=u6P3AojGYYrywrRQ']).expect(200).end((err, res) => {
                    assert.deepEqual(res.body, {success: false});
                    done();
                });
            });
        });
    });

    describe('/api/reset-password', () => {
        it('no token - should return 401', done => {
            request(app.app).post('/api/reset-password').expect(401).end((err, res) => {
                assert.equal(res.text, 'No token.');
                done();
            });
        });
        it('invalid token - should return 401', done => {
            request(app.app).post('/api/reset-password').set('Cookie', ['authToken="9cZ8R3yLIzoFnoCD"']).expect(401).end((err, res) => {
                assert.equal(res.text, 'Invalid token.');
                done();
            });
        });
        it('valid token - should return 200 and succeed', done => {
            request(app.app).post('/api/reset-password').set('Cookie', ['authToken="Ayudf3AojGxYr121"']).expect(200).end((err, res) => {
                assert.deepEqual(res.body, {success: true});
                //TO DO: validate that password was reset
                done();
            });
        });
    });

    describe('/api/add-user', () => {
        it('should return 200', done => {
            request(app.app).post('/api/add-user').expect(200, done);
        });
    });
    describe('/api/log-in', () => {
        it('invalid email - should return 200 and not succeed', done => {
            request(app.app).post('/api/log-in').send({email: 'novalid@example.com', password: 't6se;xdroighylsexuirghp;y5ier', stayLoggedIn: true}).expect(200).end((err, res) => {
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });
        it('invalid password - should return 200 and not succeed', done => {
            request(app.app).post('/api/log-in').send({email: 'test@example.com', password: 'wrongpassword', stayLoggedIn: true}).expect(200).end((err, res) => {
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });
        it('valid email and password, stay logged in - should return 200 and succeed', done => {
            const agent = request.agent(app.app);
            agent.post('/api/log-in').send({email: 'test@example.com', password: 't6se;xdroighylsexuirghp;y5ier', stayLoggedIn: true}).expect(200).end((err, res) => {
                assert.deepEqual(res.body, {success: true});
                done();
            });
        });

        it('valid email and password, not stay logged in - should return 200 and succeed', done => {
            const agent = request.agent(app.app);
            agent.post('/api/log-in').send({email: 'test@example.com', password: 't6se;xdroighylsexuirghp;y5ier', stayLoggedIn: false}).expect(200).end((err, res) => {
                assert.deepEqual(res.body, {success: true});
                agent.post('/api/authenticate').expect(200).end((err, res) => {
                    assert.deepEqual(res.body, {
                        success: true,
                        user:    {
                            id:             9,
                            first_name:     'test',
                            last_name:      '',
                            email:          'test@example.com',
                            valid_email:    1,
                            permissions:    5,
                            password_reset: 0,
                            theme:          'light'
                        }
                    });
                    done();
                });
            });
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
