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

    describe('/allUnits', () => {
        it('should return 200 with all courses', done => {
            request(app.app).get('/api/allUnits').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, name: '01-slopes-of-secant-and-tangent-lines', display_name: 'Slopes of secant and tangent lines', description: 'Find the slopes of lines intersecting functions.'}, {id: 3, name: '02-the-fundamental-theorem-of-calculus', display_name: 'The fundamental theorem of calculus', description: 'yeah'}, {id: 4, name: '03-intro-to-cells', display_name: 'Intro to cells', description: 'introduction to cells'}, {id: 2, name: '01-limits', display_name: 'Limits', description: 'One of the most important aspects of calculus.'}]);
                done();
            });
        });
    });

    describe('/unit/:id', () => {
        it('unit 1 - should return 200 with description of unit', done => {
            request(app.app).get('/api/unit/1').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, order: 1, name: '01-slopes-of-secant-and-tangent-lines', display_name: 'Slopes of secant and tangent lines', description: 'Find the slopes of lines intersecting functions.', course_id: 1}]);
                done();
            });
        });

        it('unit 2 - should return 200 with description of unit', done => {
            request(app.app).get('/api/unit/2').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 2, order: 2, name: '01-limits', display_name: 'Limits', description: 'One of the most important aspects of calculus.', course_id: 1}]);
                done();
            });
        });

        it('unit 3 - should return 200 with description of course', done => {
            request(app.app).get('/api/unit/3').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 3, order: 1, name: '02-the-fundamental-theorem-of-calculus', display_name: 'The fundamental theorem of calculus', description: 'yeah', course_id: 2}]);
                done();
            });
        });

        it('unit 5 (nonexistent) - should return 404', done => {
            request(app.app).get('/api/unit/5').expect(404, done);
        });
    });

    describe('/allArticles', () => {
        it('should return 200 with all articles', done => {
            request(app.app).get('/api/allArticles').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, title: '01-slope-review', display_title: 'Slope Review', publish_date: '2019-02-06T00:19:21.000Z', update_date: '2019-02-06T00:19:21.000Z'}, {id: 3, title: '02-intro-to-limits', display_title: 'Intro to Limits', publish_date: '2019-02-06T00:23:23.000Z', update_date: '2019-02-06T00:23:23.000Z'}, {id: 4, title: '03-the-fundamental-theorem-of-calculus-part-1', display_title: 'The Fundamental Theorem of Calculus, part 1', publish_date: '2019-02-06T22:36:17.000Z', update_date: '2019-02-06T22:36:17.000Z'}, {id: 2, title: '01-secant-lines', display_title: 'Secant Lines', publish_date: '2019-02-06T00:20:30.000Z', update_date: '2019-02-06T00:20:30.000Z'}]);
                done();
            });
        });
    });

    describe('/article/:id', () => {
        it('article 1 - should return 200 with description of article', done => {
            request(app.app).get('/api/article/1').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, order: 1, title: '01-slope-review', display_title: 'Slope Review', publish_date: '2019-02-06T00:19:21.000Z', update_date: '2019-02-06T00:19:21.000Z', unit_id: 1}]);
                done();
            });
        });

        it('article 2 - should return 200 with description of article', done => {
            request(app.app).get('/api/article/2').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 2, order: 2, title: '01-secant-lines', display_title: 'Secant Lines', publish_date: '2019-02-06T00:20:30.000Z', update_date: '2019-02-06T00:20:30.000Z', unit_id: 1}]);
                done();
            });
        });

        it('article 3 - should return 200 with description of article', done => {
            request(app.app).get('/api/article/3').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 3, order: 1, title: '02-intro-to-limits', display_title: 'Intro to Limits', publish_date: '2019-02-06T00:23:23.000Z', update_date: '2019-02-06T00:23:23.000Z', unit_id: 2}]);
                done();
            });
        });

        it('article 4 - should return 200 with description of article', done => {
            request(app.app).get('/api/article/4').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 4, order: 1, title: '03-the-fundamental-theorem-of-calculus-part-1', display_title: 'The Fundamental Theorem of Calculus, part 1', publish_date: '2019-02-06T22:36:17.000Z', update_date: '2019-02-06T22:36:17.000Z', unit_id: 3}]);
                done();
            });
        });

        it('article 5 (nonexistent) - should return 404', done => {
            request(app.app).get('/api/article/5').expect(404, done);
        });
    });

    describe('/article-content/:id', () => {
        it('article-content 1 - should return 200 with content of article', done => {
            request(app.app).get('/api/article-content/1').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, content: '<p>ya you gotta find the slopes of things lol</p>'}]);
                done();
            });
        });

        it('article-content 2 - should return 200 with content of article', done => {
            request(app.app).get('/api/article-content/2').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 2, content: '<p>a secant line is a line which intersects with a function twice.</p>'}]);
                done();
            });
        });


        it('article-content 3 - should return 200 with content of article', done => {
            request(app.app).get('/api/article-content/3').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 3, content: '<p>A limit takes a function and allows us to know what happens when the function approaches a value.</p>'}]);
                done();
            });
        });

        it('article-content 4 - should return 200 with content of article', done => {
            request(app.app).get('/api/article-content/4').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 4, content: '<p>wow</p>'}]);
                done();
            });
        });

        it('article-content 5 (nonexistent) - should return 404', done => {
            request(app.app).get('/api/article-content/5').expect(404, done);
        });
    });

    describe('/parent', () => {
        describe('query by article', () => {
            it('article 1, by id, query for subject - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=subject&article=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'mathematics', display_name: 'Mathematics', description: 'Mathematics (from Greek ?????? máth?ma, "knowledge, study, learning") includes the study of such topics as quantity, structure, space, and change.', color: '3f73d9'}]);
                    done();
                });
            });
            it('article 1, by name, query for subject - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=subject&article=01-slope-review').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'mathematics', display_name: 'Mathematics', description: 'Mathematics (from Greek ?????? máth?ma, "knowledge, study, learning") includes the study of such topics as quantity, structure, space, and change.', color: '3f73d9'}]);
                    done();
                });
            });
            it('article 1, by id, query for course - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=course&article=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'differential-calculus', display_name: 'Differential calculus', description: 'haha calculus', subject_id: 1}]);
                    done();
                });
            });
            it('article 1, by name, query for course - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=course&article=01-slope-review').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'differential-calculus', display_name: 'Differential calculus', description: 'haha calculus', subject_id: 1}]);
                    done();
                });
            });
            it('article 1, by id, query for unit - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=unit&article=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: '01-slopes-of-secant-and-tangent-lines', display_name: 'Slopes of secant and tangent lines', description: 'Find the slopes of lines intersecting functions.', course_id: 1}]);
                    done();
                });
            });
            it('article 1, by name, query for unit - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=unit&article=01-slope-review').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: '01-slopes-of-secant-and-tangent-lines', display_name: 'Slopes of secant and tangent lines', description: 'Find the slopes of lines intersecting functions.', course_id: 1}]);
                    done();
                });
            });

            it('article 3, by id, query for subject - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=subject&article=3').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'mathematics', display_name: 'Mathematics', description: 'Mathematics (from Greek ?????? máth?ma, "knowledge, study, learning") includes the study of such topics as quantity, structure, space, and change.', color: '3f73d9'}]);
                    done();
                });
            });
            it('article 3, by name, query for subject - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=subject&article=02-intro-to-limits').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'mathematics', display_name: 'Mathematics', description: 'Mathematics (from Greek ?????? máth?ma, "knowledge, study, learning") includes the study of such topics as quantity, structure, space, and change.', color: '3f73d9'}]);
                    done();
                });
            });
            it('article 3, by id, query for course - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=course&article=3').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'differential-calculus', display_name: 'Differential calculus', description: 'haha calculus', subject_id: 1}]);
                    done();
                });
            });
            it('article 3, by name, query for course - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=course&article=02-intro-to-limits').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'differential-calculus', display_name: 'Differential calculus', description: 'haha calculus', subject_id: 1}]);
                    done();
                });
            });
            it('article 3, by id, query for unit - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=unit&article=3').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 2, name: '01-limits', display_name: 'Limits', description: 'One of the most important aspects of calculus.', course_id: 1}]);
                    done();
                });
            });
            it('article 3, by name, query for unit - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=unit&article=02-intro-to-limits').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 2, name: '01-limits', display_name: 'Limits', description: 'One of the most important aspects of calculus.', course_id: 1}]);
                    done();
                });
            });

            it('article 5 (nonexistent), by id - should return 404', done => {
                request(app.app).get('/api/parent?want=unit&article=5').expect(404, done);
            });

            it('article 5 (nonexistent), by name - should return 404', done => {
                request(app.app).get('/api/parent?want=unit&article=thisarticledoesnotexist').expect(404, done);
            });
        });

        describe('query by unit', () => {
            it('unit 1, by id, query for subject - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=subject&unit=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'mathematics', display_name: 'Mathematics', description: 'Mathematics (from Greek ?????? máth?ma, "knowledge, study, learning") includes the study of such topics as quantity, structure, space, and change.', color: '3f73d9'}]);
                    done();
                });
            });
            it('unit 1, by name, query for subject - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=subject&unit=01-slopes-of-secant-and-tangent-lines').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'mathematics', display_name: 'Mathematics', description: 'Mathematics (from Greek ?????? máth?ma, "knowledge, study, learning") includes the study of such topics as quantity, structure, space, and change.', color: '3f73d9'}]);
                    done();
                });
            });
            it('unit 1, by id, query for course - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=course&unit=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'differential-calculus', display_name: 'Differential calculus', description: 'haha calculus', subject_id: 1}]);
                    done();
                });
            });
            it('unit 1, by name, query for course - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=course&unit=01-slopes-of-secant-and-tangent-lines').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'differential-calculus', display_name: 'Differential calculus', description: 'haha calculus', subject_id: 1}]);
                    done();
                });
            });
            it('unit 1, by id, query for unit - should return 404', done => {
                request(app.app).get('/api/parent?want=unit&unit=1').expect(404, done);
            });
            it('unit 1, by name, query for unit - should return 404', done => {
                request(app.app).get('/api/parent?want=unit&unit=01-slopes-of-secant-and-tangent-lines').expect(404, done);
            });

            it('unit 4, by id, query for subject - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=subject&unit=4').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 2, name: 'biology', display_name: 'Biology', description: 'wowie isn\'t biology fun', color: 'd13692'}]);
                    done();
                });
            });
            it('unit 4, by name, query for subject - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=subject&unit=03-intro-to-cells').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 2, name: 'biology', display_name: 'Biology', description: 'wowie isn\'t biology fun', color: 'd13692'}]);
                    done();
                });
            });
            it('unit 4, by id, query for course - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=course&unit=4').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 3, name: 'cells', display_name: 'Cells', description: 'cells are pretty cool!', subject_id: 2}]);
                    done();
                });
            });
            it('unit 4, by name, query for course - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=course&unit=03-intro-to-cells').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 3, name: 'cells', display_name: 'Cells', description: 'cells are pretty cool!', subject_id: 2}]);
                    done();
                });
            });
            it('unit 4, by id, query for unit - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=unit&unit=4').expect(404, done);
            });
            it('unit 4, by name, query for unit - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=unit&unit=03-intro-to-cells').expect(404, done);
            });
        });
    });
});

after('close server', () => {
    app.server.close();
});
