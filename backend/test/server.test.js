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
                if (err) throw err;
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });
        it('invalid token - should return 200 and not succeed', done => {
            request(app.app).post('/api/authenticate').set('Cookie', ['authToken=thisshouldfail']).expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });

        it('expired token - should return 200 and not succeed', done => {
            request(app.app).post('/api/authenticate').set('Cookie', ['authToken=9cZ8R3yLIzoFnoCD']).expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });
        it('valid token - should return 200 and succeed', done => {
            request(app.app).post('/api/authenticate').set('Cookie', ['authToken=u6P3AojGYYrywrRQ']).expect(200).end((err, res) => {
                if (err) throw err;
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
                if (err) throw err;
                assert.equal(res.text, 'You are not logged in.');
                done();
            });
        });

        it('invalid token - should return 200 and not succeed', done => {
            request(app.app).post('/api/log-out').set('Cookie', ['authToken=9cZ8R3yLIzoFnoCD']).expect(200).end((err, res) => {
                if (err) throw err;
                assert.equal(res.text, 'You are not logged in.');
                done();
            });
        });

        it('valid token - should return 200 and token should be invalidated', done => {
            const agent = request.agent(app.app);
            agent.post('/api/log-out').set('Cookie', ['authToken=u6P3AojGYYrywrRQ']).expect(200).end((err, res) => {
                if (err) throw err;
                assert.equal(res.text, 'Logged out.');
                agent.post('/api/authenticate').set('Cookie', ['authToken=u6P3AojGYYrywrRQ']).expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, {success: false});
                    done();
                });
            });
        });
    });

    describe('/api/reset-password', () => {
        it('no token - should return 401', done => {
            request(app.app).post('/api/reset-password').expect(401).end((err, res) => {
                if (err) throw err;
                assert.equal(res.text, 'No token.');
                done();
            });
        });
        it('invalid token - should return 401', done => {
            request(app.app).post('/api/reset-password').set('Cookie', ['authToken="9cZ8R3yLIzoFnoCD"']).expect(401).end((err, res) => {
                if (err) throw err;
                assert.equal(res.text, 'Invalid token.');
                done();
            });
        });
        it('valid token - should return 200 and succeed', done => {
            request(app.app).post('/api/reset-password').set('Cookie', ['authToken="Ayudf3AojGxYr121"']).expect(200).end((err, res) => {
                if (err) throw err;
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
                if (err) throw err;
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });
        it('invalid password - should return 200 and not succeed', done => {
            request(app.app).post('/api/log-in').send({email: 'test@example.com', password: 'wrongpassword', stayLoggedIn: true}).expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, {success: false});
                done();
            });
        });
        it('valid email and password, stay logged in - should return 200 and succeed', done => {
            const agent = request.agent(app.app);
            agent.post('/api/log-in').send({email: 'test@example.com', password: 't6se;xdroighylsexuirghp;y5ier', stayLoggedIn: true}).expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, {success: true});
                done();
            });
        });

        it('valid email and password, not stay logged in - should return 200 and succeed', done => {
            const agent = request.agent(app.app);
            agent.post('/api/log-in').send({email: 'test@example.com', password: 't6se;xdroighylsexuirghp;y5ier', stayLoggedIn: false}).expect(200).end((err, res) => {
                if (err) throw err;
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
        it('should return 200', done => {
            request(app.app).post('/api/resend-verification-email').expect(200, done);
        });
    });

    describe('/allSubjects', () => {
        it('should return 200 with all subjects', done => {
            request(app.app).get('/api/allSubjects').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, name: 'mathematics', display_name: 'Mathematics', description: 'Mathematics (from Greek ?????? máth?ma, "knowledge, study, learning") includes the study of such topics as quantity, structure, space, and change.', color: '3f73d9'}, {id: 2, name: 'biology', display_name: 'Biology', description: 'wowie isn\'t biology fun', color: 'd13692'}, {id: 3, name: 'chemistry', display_name: 'Chemistry', description: 'Chemistry is the scientific discipline involved with elements and compounds composed of atoms, molecules and ions: their composition, structure, properties, behavior and the changes they undergo during a reaction with other substances.', color: 'eae02c'}]);
                done();
            });
        });
    });

    describe('/subject/:id', () => {
        it('subject 1 - should return 200 with description of subject', done => {
            request(app.app).get('/api/subject/1').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, order: 1, name: 'mathematics', display_name: 'Mathematics', description: 'Mathematics (from Greek ?????? máth?ma, "knowledge, study, learning") includes the study of such topics as quantity, structure, space, and change.', color: '3f73d9'}]);
                done();
            });
        });

        it('subject 2 - should return 200 with description of subject', done => {
            request(app.app).get('/api/subject/2').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 2, order: 2, name: 'biology', display_name: 'Biology', description: 'wowie isn\'t biology fun', color: 'd13692'}]);
                done();
            });
        });

        it('subject 3 - should return 200 with description of subject', done => {
            request(app.app).get('/api/subject/3').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 3, order: 3, name: 'chemistry', display_name: 'Chemistry', description: 'Chemistry is the scientific discipline involved with elements and compounds composed of atoms, molecules and ions: their composition, structure, properties, behavior and the changes they undergo during a reaction with other substances.', color: 'eae02c'}]);
                done();
            });
        });

        it('subject 4 (nonexistent) - should return 404', done => {
            request(app.app).get('/api/subject/4').expect(404, done);
        });
    });

    describe('/allCourses', () => {
        it('should return 200 with all courses', done => {
            request(app.app).get('/api/allCourses').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, subject_id: 1, name: 'differential-calculus', display_name: 'Differential calculus', description: 'haha calculus'}, {id: 3, subject_id: 2, name: 'cells', display_name: 'Cells', description: 'cells are pretty cool!'}, {id: 2, subject_id: 1, name: 'integral-calculus', display_name: 'Integral calculus', description: 'finding area under curves, antiderivatives, etc.'}]);
                done();
            });
        });
    });

    describe('/course/:id', () => {
        it('course 1 - should return 200 with description of course', done => {
            request(app.app).get('/api/course/1').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, order: 1, name: 'differential-calculus', display_name: 'Differential calculus', description: 'haha calculus', subject_id: 1}]);
                done();
            });
        });

        it('course 2 - should return 200 with description of course', done => {
            request(app.app).get('/api/course/2').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 2, order: 2, name: 'integral-calculus', display_name: 'Integral calculus', description: 'finding area under curves, antiderivatives, etc.', subject_id: 1}]);
                done();
            });
        });

        it('course 3 - should return 200 with description of course', done => {
            request(app.app).get('/api/course/3').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 3, order: 1, name: 'cells', display_name: 'Cells', description: 'cells are pretty cool!', subject_id: 2}]);
                done();
            });
        });

        it('course 4 (nonexistent) - should return 404', done => {
            request(app.app).get('/api/course/4').expect(404, done);
        });
    });
});

after('close server', () => {
    app.server.close();
});
