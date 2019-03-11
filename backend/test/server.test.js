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
                        id:             19,
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
            agent.post('/api/log-in').send({email: 'test@example.com', password: 'h9fu84whj8j9i', stayLoggedIn: true}).expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, {success: true});
                agent.post('/api/authenticate').expect(200).end((err, res) => {
                    assert.deepEqual(res.body, {
                        success: true,
                        user:    {
                            id:             20,
                            first_name:     'Test',
                            last_name:      'Account',
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

        it('valid email and password, not stay logged in - should return 200 and succeed', done => {
            const agent = request.agent(app.app);
            agent.post('/api/log-in').send({email: 'test@example.com', password: 'h9fu84whj8j9i', stayLoggedIn: false}).expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, {success: true});
                agent.post('/api/authenticate').expect(200).end((err, res) => {
                    assert.deepEqual(res.body, {
                        success: true,
                        user:    {
                            id:             20,
                            first_name:     'Test',
                            last_name:      'Account',
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
                assert.deepEqual(res.body, [{id: 1, title: '01-slope-review', display_title: 'Slope Review', publish_date: '2019-03-11T06:54:13.000Z', update_date: '2019-03-11T06:54:26.000Z'}, {id: 3, title: '02-intro-to-limits', display_title: 'Intro to Limits', publish_date: '2019-03-11T06:54:13.000Z', update_date: '2019-03-11T06:54:26.000Z'}, {id: 4, title: '03-the-fundamental-theorem-of-calculus-part-1', display_title: 'The Fundamental Theorem of Calculus, part 1', publish_date: '2019-03-11T06:54:13.000Z', update_date: '2019-03-11T06:54:26.000Z'}, {id: 2, title: '01-secant-lines', display_title: 'Secant Lines', publish_date: '2019-03-11T06:54:13.000Z', update_date: '2019-03-11T06:54:26.000Z'}]);
                done();
            });
        });
    });

    describe('/article/:id', () => {
        it('article 1 - should return 200 with description of article', done => {
            request(app.app).get('/api/article/1').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, order: 1, title: '01-slope-review', display_title: 'Slope Review', publish_date: '2019-03-11T06:54:13.000Z', update_date: '2019-03-11T06:54:26.000Z', unit_id: 1}]);
                done();
            });
        });

        it('article 2 - should return 200 with description of article', done => {
            request(app.app).get('/api/article/2').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 2, order: 2, title: '01-secant-lines', display_title: 'Secant Lines', publish_date: '2019-03-11T06:54:13.000Z', update_date: '2019-03-11T06:54:26.000Z', unit_id: 1}]);
                done();
            });
        });

        it('article 3 - should return 200 with description of article', done => {
            request(app.app).get('/api/article/3').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 3, order: 1, title: '02-intro-to-limits', display_title: 'Intro to Limits', publish_date: '2019-03-11T06:54:13.000Z', update_date: '2019-03-11T06:54:26.000Z', unit_id: 2}]);
                done();
            });
        });

        it('article 4 - should return 200 with description of article', done => {
            request(app.app).get('/api/article/4').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 4, order: 1, title: '03-the-fundamental-theorem-of-calculus-part-1', display_title: 'The Fundamental Theorem of Calculus, part 1', publish_date: '2019-03-11T06:54:13.000Z', update_date: '2019-03-11T06:54:26.000Z', unit_id: 3}]);
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
                assert.deepEqual(res.body, [{id: 1, content: '<h1>Slope</h1>\n<p>Given two points, <span class="katex"><span class="katex-mathml">(x1,y1)(x<em>1,y</em>1)</span><span class="katex-html"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right:0.03588em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:-0.03588em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span> and <span class="katex"><span class="katex-mathml">(x2,y2)(x<em>2,y</em>2)</span><span class="katex-html"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right:0.03588em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:-0.03588em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span>, the slope formed by the line connecting the points can be calculated with:\n<span class="katex-display"><span class="katex"><span class="katex-mathml">m=y2−y1x2−x1m=\\frac{y<em>2-y</em>1}{x<em>2-x</em>1}</span><span class="katex-html"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathdefault">m</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:2.09633em;vertical-align:-0.8360000000000001em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.2603300000000002em;"><span style="top:-2.3139999999999996em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathdefault" style="margin-right:0.03588em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:-0.03588em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right:0.03588em;">y</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:-0.03588em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.8360000000000001em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></p>\n<h3>Quadratic formula</h3>\n<p>The roots of a given quadratic function, <span class="katex"><span class="katex-mathml">ax2+bx+cax^2+bx+c</span><span class="katex-html"><span class="base"><span class="strut" style="height:0.897438em;vertical-align:-0.08333em;"></span><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.77777em;vertical-align:-0.08333em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathdefault">c</span></span></span></span> can be found with the quadratic equation:\n<span class="katex-display"><span class="katex"><span class="katex-mathml">x=−b±b2−4ac2ax=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}</span><span class="katex-html"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:2.276389em;vertical-align:-0.686em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.590389em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">2</span><span class="mord mathdefault">a</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">−</span><span class="mord mathdefault">b</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">±</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord sqrt"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.913389em;"><span class="svg-align" style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord" style="padding-left:0.833em;"><span class="mord"><span class="mord mathdefault">b</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.740108em;"><span style="top:-2.9890000000000003em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord">4</span><span class="mord mathdefault">a</span><span class="mord mathdefault">c</span></span></span><span style="top:-2.873389em;"><span class="pstrut" style="height:3em;"></span><span class="hide-tail" style="min-width:0.853em;height:1.08em;"><svg width="400em" height="1.08em" viewbox="0 0 400000 1080" preserveaspectratio="xMinYMin slice"><path d="M95,702c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,\n-10,-9.5,-14c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54c44.2,-33.3,65.8,\n-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10s173,378,173,378c0.7,0,\n35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429c69,-144,104.5,-217.7,106.5,\n-221c5.3,-9.3,12,-14,20,-14H400000v40H845.2724s-225.272,467,-225.272,467\ns-235,486,-235,486c-2.7,4.7,-9,7,-19,7c-6,0,-10,-1,-12,-3s-194,-422,-194,-422\ns-65,47,-65,47z M834 80H400000v40H845z"></path></svg></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.12661100000000003em;"><span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></p>\n<h2>First principal derivative of a quadratic, <span class="katex"><span class="katex-mathml">f(x)=ax2+bx+cf(x)=ax^2+bx+c</span><span class="katex-html"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathdefault" style="margin-right:0.10764em;">f</span><span class="mopen">(</span><span class="mord mathdefault">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.897438em;vertical-align:-0.08333em;"></span><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.77777em;vertical-align:-0.08333em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathdefault">c</span></span></span></span>:</h2>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml">dydx=lim⁡h→0f(x+h)−f(x)h=lim⁡h→0(a(x+h)2+b(x+h)+c)−(ax2+bx+c)h=lim⁡h→0(ax2+ah2+2axh+bx+bh+c)−(ax2+bx+c)h=lim⁡h→0ax2+ah2+2axh+bx+bh+c−ax2−bx−ch=lim⁡h→0ax2−ax2+bx−bx+c−c+ah2+2axh+bhh=lim⁡h→0ah2+2axh+bhh=lim⁡h→0ah+2ax+bdydx=f′(x)=2a+b\n\\begin{aligned}\n\\frac{dy}{dx}&amp;=\\lim<em>{h\\to 0}\\frac{f(x+h)-f(x)}{h}\\\n&amp;=\\lim</em>{h\\to 0}\\frac{\\left(a(x+h)^2+b(x+h)+c\\right)-(ax^2+bx+c)}{h}\\\n&amp;=\\lim<em>{h\\to 0}\\frac{\\left(ax^2+ah^2+2axh+bx+bh+c\\right)-(ax^2+bx+c)}{h}\\\n&amp;=\\lim</em>{h\\to 0}\\frac{ax^2+ah^2+2axh+bx+bh+c-ax^2-bx-c}{h}\\\n&amp;=\\lim<em>{h\\to 0}\\frac{ax^2-ax^2+bx-bx+c-c+ah^2+2axh+bh}{h}\\\n&amp;=\\lim</em>{h\\to 0}\\frac{ah^2+2axh+bh}{h}\\\n&amp;=\\lim_{h\\to 0}ah+2ax+b\\\n\\frac{dy}{dx}=f\'(x)&amp;=2a+b\\\n\\end{aligned}\\\n</span><span class="katex-html"><span class="base"><span class="strut" style="height:19.642540000000004em;vertical-align:-9.57127em;"></span><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:10.071270000000002em;"><span style="top:-12.234280000000002em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3714399999999998em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">d</span><span class="mord mathdefault">x</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">d</span><span class="mord mathdefault" style="margin-right:0.03588em;">y</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span><span style="top:-9.592162000000002em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"></span></span><span style="top:-6.950044000000002em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"></span></span><span style="top:-4.406828000000001em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"></span></span><span style="top:-1.8636119999999998em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"></span></span><span style="top:0.6796040000000012em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"></span></span><span style="top:2.5717120000000007em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"></span></span><span style="top:4.995260000000001em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3714399999999998em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">d</span><span class="mord mathdefault">x</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">d</span><span class="mord mathdefault" style="margin-right:0.03588em;">y</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right:0.10764em;">f</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.801892em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mopen">(</span><span class="mord mathdefault">x</span><span class="mclose">)</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:9.57127em;"><span></span></span></span></span></span><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:10.071270000000002em;"><span style="top:-12.234280000000002em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.69444em;"><span style="top:-2.047892em;margin-left:0em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">h</span><span class="mrel mtight">→</span><span class="mord mtight">0</span></span></span></span><span style="top:-2.7em;"><span class="pstrut" style="height:2.7em;"></span><span><span class="mop">lim</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7521079999999999em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">h</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right:0.10764em;">f</span><span class="mopen">(</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">h</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault" style="margin-right:0.10764em;">f</span><span class="mopen">(</span><span class="mord mathdefault">x</span><span class="mclose">)</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span><span style="top:-9.592162000000002em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.69444em;"><span style="top:-2.047892em;margin-left:0em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">h</span><span class="mrel mtight">→</span><span class="mord mtight">0</span></span></span></span><span style="top:-2.7em;"><span class="pstrut" style="height:2.7em;"></span><span><span class="mop">lim</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7521079999999999em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.59001em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">h</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.7400100000000003em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="minner"><span class="mopen delimcenter" style="top:0em;"><span class="delimsizing size1">(</span></span><span class="mord mathdefault">a</span><span class="mopen">(</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">h</span><span class="mclose"><span class="mclose">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mopen">(</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">h</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">c</span><span class="mclose delimcenter" style="top:0em;"><span class="delimsizing size1">)</span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mopen">(</span><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">c</span><span class="mclose">)</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span><span style="top:-6.950044000000002em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.69444em;"><span style="top:-2.047892em;margin-left:0em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">h</span><span class="mrel mtight">→</span><span class="mord mtight">0</span></span></span></span><span style="top:-2.7em;"><span class="pstrut" style="height:2.7em;"></span><span><span class="mop">lim</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7521079999999999em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.59001em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">h</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.7400100000000003em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="minner"><span class="mopen delimcenter" style="top:0em;"><span class="delimsizing size1">(</span></span><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">h</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord">2</span><span class="mord mathdefault">a</span><span class="mord mathdefault">x</span><span class="mord mathdefault">h</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">h</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">c</span><span class="mclose delimcenter" style="top:0em;"><span class="delimsizing size1">)</span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mopen">(</span><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">c</span><span class="mclose">)</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span><span style="top:-4.406828000000001em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.69444em;"><span style="top:-2.047892em;margin-left:0em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">h</span><span class="mrel mtight">→</span><span class="mord mtight">0</span></span></span></span><span style="top:-2.7em;"><span class="pstrut" style="height:2.7em;"></span><span><span class="mop">lim</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7521079999999999em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.491108em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">h</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">h</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord">2</span><span class="mord mathdefault">a</span><span class="mord mathdefault">x</span><span class="mord mathdefault">h</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">h</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">c</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">c</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span><span style="top:-1.8636119999999998em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.69444em;"><span style="top:-2.047892em;margin-left:0em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">h</span><span class="mrel mtight">→</span><span class="mord mtight">0</span></span></span></span><span style="top:-2.7em;"><span class="pstrut" style="height:2.7em;"></span><span><span class="mop">lim</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7521079999999999em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.491108em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">h</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">c</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">c</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">h</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord">2</span><span class="mord mathdefault">a</span><span class="mord mathdefault">x</span><span class="mord mathdefault">h</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">h</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span><span style="top:0.6796040000000012em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.69444em;"><span style="top:-2.047892em;margin-left:0em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">h</span><span class="mrel mtight">→</span><span class="mord mtight">0</span></span></span></span><span style="top:-2.7em;"><span class="pstrut" style="height:2.7em;"></span><span><span class="mop">lim</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7521079999999999em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.491108em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">h</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">h</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord">2</span><span class="mord mathdefault">a</span><span class="mord mathdefault">x</span><span class="mord mathdefault">h</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">h</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span><span style="top:2.5717120000000007em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.69444em;"><span style="top:-2.047892em;margin-left:0em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">h</span><span class="mrel mtight">→</span><span class="mord mtight">0</span></span></span></span><span style="top:-2.7em;"><span class="pstrut" style="height:2.7em;"></span><span><span class="mop">lim</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7521079999999999em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord mathdefault">a</span><span class="mord mathdefault">h</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord">2</span><span class="mord mathdefault">a</span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span></span></span><span style="top:4.995260000000001em;"><span class="pstrut" style="height:3.59001em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mord">2</span><span class="mord mathdefault">a</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:9.57127em;"><span></span></span></span></span></span></span></span></span><span class="mspace newline"></span></span></span></span></p>\n<h2>L\'Hopital\'s rule</h2>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml">lim⁡x→cf(x)g(x)=lim⁡x→cf′(x)g′(x)\\mathop {\\lim }\\limits<em>{x \\to c} \\frac{{f\\left( x \\right)}}{{g\\left( x \\right)}} = \\mathop {\\lim }\\limits</em>{x \\to c} \\frac{{f\'\\left( x \\right)}}{{g\'\\left( x \\right)}}</span><span class="katex-html"><span class="base"><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.69444em;"><span style="top:-2.1em;margin-left:0em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">x</span><span class="mrel mtight">→</span><span class="mord mathdefault mtight">c</span></span></span></span><span style="top:-2.7em;"><span class="pstrut" style="height:2.7em;"></span><span><span class="mop"><span class="mop">lim</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathdefault" style="margin-right:0.03588em;">g</span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord mathdefault">x</span><span class="mclose delimcenter" style="top:0em;">)</span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathdefault" style="margin-right:0.10764em;">f</span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord mathdefault">x</span><span class="mclose delimcenter" style="top:0em;">)</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:2.364892em;vertical-align:-0.936em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.69444em;"><span style="top:-2.1em;margin-left:0em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">x</span><span class="mrel mtight">→</span><span class="mord mathdefault mtight">c</span></span></span></span><span style="top:-2.7em;"><span class="pstrut" style="height:2.7em;"></span><span><span class="mop"><span class="mop">lim</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.428892em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord mathdefault" style="margin-right:0.03588em;">g</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6778919999999999em;"><span style="top:-2.9890000000000003em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord mathdefault">x</span><span class="mclose delimcenter" style="top:0em;">)</span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord mathdefault" style="margin-right:0.10764em;">f</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.751892em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord mathdefault">x</span><span class="mclose delimcenter" style="top:0em;">)</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></p>\n<h2>Maxwell\'s Equation - Faraday\'s Law</h2>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml">∮CE⋅dℓ=−ddt∫SBndA\\oint<em>C {E \\cdot d\\ell  =  - \\frac{d}{{dt}}} \\int</em>S {B_n dA}</span><span class="katex-html"><span class="base"><span class="strut" style="height:2.28339em;vertical-align:-0.9119499999999999em;"></span><span class="mop"><span class="mop op-symbol large-op" style="margin-right:0.44445em;position:relative;top:-0.0011249999999999316em;">∮</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:-0.433619em;"><span style="top:-1.7880500000000001em;margin-left:-0.44445em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathdefault mtight" style="margin-right:0.07153em;">C</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.9119499999999999em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right:0.05764em;">E</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">⋅</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">d</span><span class="mord">ℓ</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mord">−</span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.37144em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathdefault">d</span><span class="mord mathdefault">t</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">d</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mop"><span class="mop op-symbol large-op" style="margin-right:0.44445em;position:relative;top:-0.0011249999999999316em;">∫</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:-0.433619em;"><span style="top:-1.7880500000000001em;margin-left:-0.44445em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathdefault mtight" style="margin-right:0.05764em;">S</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.9119499999999999em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mord"><span class="mord mathdefault" style="margin-right:0.05017em;">B</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.151392em;"><span style="top:-2.5500000000000003em;margin-left:-0.05017em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathdefault mtight">n</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mord mathdefault">d</span><span class="mord mathdefault">A</span></span></span></span></span></span></p>\n<h2>Acid Ionization Constant</h2>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml">Ka=[H+][A−][HA]K_a  = \\frac{{\\left[ {H^ +  } \\right]\\left[ {A^ -  } \\right]}}{{\\left[ {HA} \\right]}}</span><span class="katex-html"><span class="base"><span class="strut" style="height:0.83333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right:0.07153em;">K</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.151392em;"><span style="top:-2.5500000000000003em;margin-left:-0.07153em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathdefault mtight">a</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:2.384331em;vertical-align:-0.936em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.448331em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="minner"><span class="mopen delimcenter" style="top:0em;">[</span><span class="mord"><span class="mord mathdefault" style="margin-right:0.08125em;">H</span><span class="mord mathdefault">A</span></span><span class="mclose delimcenter" style="top:0em;">]</span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="minner"><span class="mopen delimcenter" style="top:0em;">[</span><span class="mord"><span class="mord"><span class="mord mathdefault" style="margin-right:0.08125em;">H</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.771331em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mbin mtight">+</span></span></span></span></span></span></span></span></span><span class="mclose delimcenter" style="top:0em;">]</span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">[</span><span class="mord"><span class="mord"><span class="mord mathdefault">A</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.771331em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mbin mtight">−</span></span></span></span></span></span></span></span></span><span class="mclose delimcenter" style="top:0em;">]</span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></p>\n<h2>Discrete-Time Fourier transform of a unit step function</h2>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml">u(n)⇔1(1−e−jω)+∑k=−∞∞πδ(ω+2πk)u(n) \\Leftrightarrow \\frac{1}{{(1 - e^{ - j\\omega } )}} + \\sum\\limits_{k =  - \\infty }^\\infty  {\\pi \\delta (\\omega  + 2\\pi k)}</span><span class="katex-html"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathdefault">u</span><span class="mopen">(</span><span class="mord mathdefault">n</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">⇔</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:2.25744em;vertical-align:-0.936em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.32144em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mopen">(</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord"><span class="mord mathdefault">e</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.750664em;"><span style="top:-2.9890000000000003em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">−</span><span class="mord mathdefault mtight" style="margin-right:0.05724em;">j</span><span class="mord mathdefault mtight" style="margin-right:0.03588em;">ω</span></span></span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span></span><span class="base"><span class="strut" style="height:3.0118410000000004em;vertical-align:-1.360444em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.6513970000000002em;"><span style="top:-1.8478869999999998em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight" style="margin-right:0.03148em;">k</span><span class="mrel mtight">=</span><span class="mord mtight">−</span><span class="mord mtight">∞</span></span></span></span><span style="top:-3.0500049999999996em;"><span class="pstrut" style="height:3.05em;"></span><span><span class="mop op-symbol large-op">∑</span></span></span><span style="top:-4.300005em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">∞</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.360444em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right:0.03588em;">π</span><span class="mord mathdefault" style="margin-right:0.03785em;">δ</span><span class="mopen">(</span><span class="mord mathdefault" style="margin-right:0.03588em;">ω</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord">2</span><span class="mord mathdefault" style="margin-right:0.03588em;">π</span><span class="mord mathdefault" style="margin-right:0.03148em;">k</span><span class="mclose">)</span></span></span></span></span></span></p>\n<h2>Binomial Coefficient</h2>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml">(nk)=n!k!(n−k)!\\begin{pmatrix}n\\k\\\\end{pmatrix} = \\frac{n!}{k!\\left(n - k\\right)!}</span><span class="katex-html"><span class="base"><span class="strut" style="height:2.40003em;vertical-align:-0.95003em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;"><span class="delimsizing size3">(</span></span><span class="mord"><span class="mtable"><span class="col-align-c"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.45em;"><span style="top:-3.61em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">n</span></span></span><span style="top:-2.4099999999999997em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right:0.03148em;">k</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.9500000000000004em;"><span></span></span></span></span></span></span></span><span class="mclose delimcenter" style="top:0em;"><span class="delimsizing size3">)</span></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:2.30744em;vertical-align:-0.936em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.37144em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right:0.03148em;">k</span><span class="mclose">!</span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord mathdefault">n</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault" style="margin-right:0.03148em;">k</span><span class="mclose delimcenter" style="top:0em;">)</span></span><span class="mclose">!</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault">n</span><span class="mclose">!</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></p>\n<h2>Radii of stable orbits in the Bohr model</h2>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml">r=n2ℏ2mekZe2=n2a0Zr = n^2 \\frac{{\\hbar ^2 }}{{m<em>e kZe^2 }} = n^2 \\frac{{a</em>0 }}{Z}</span><span class="katex-html"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathdefault" style="margin-right:0.02778em;">r</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:2.327108em;vertical-align:-0.8360000000000001em;"></span><span class="mord"><span class="mord mathdefault">n</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8641079999999999em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.491108em;"><span style="top:-2.3139999999999996em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord mathdefault">m</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.151392em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathdefault mtight">e</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mord mathdefault" style="margin-right:0.03148em;">k</span><span class="mord mathdefault" style="margin-right:0.07153em;">Z</span><span class="mord"><span class="mord mathdefault">e</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.740108em;"><span style="top:-2.9890000000000003em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord">ℏ</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.8360000000000001em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1.7935599999999998em;vertical-align:-0.686em;"></span><span class="mord"><span class="mord mathdefault">n</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8641079999999999em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.1075599999999999em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathdefault" style="margin-right:0.07153em;">Z</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord mathdefault">a</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.30110799999999993em;"><span style="top:-2.5500000000000003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">0</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></p>\n<h2>Van der Waals equation</h2>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml">(P+an2V2)(V−bn)=nRT\\left( {P + \\frac{{an^2 }}{{V^2 }}} \\right)\\left( {V - bn} \\right) = nRT</span><span class="katex-html"><span class="base"><span class="strut" style="height:2.441138em;vertical-align:-0.95003em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;"><span class="delimsizing size3">(</span></span><span class="mord"><span class="mord mathdefault" style="margin-right:0.13889em;">P</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.491108em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord"><span class="mord mathdefault" style="margin-right:0.22222em;">V</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.740108em;"><span style="top:-2.9890000000000003em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="mord mathdefault">a</span><span class="mord"><span class="mord mathdefault">n</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span><span class="mclose delimcenter" style="top:0em;"><span class="delimsizing size3">)</span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord"><span class="mord mathdefault" style="margin-right:0.22222em;">V</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord mathdefault">b</span><span class="mord mathdefault">n</span></span><span class="mclose delimcenter" style="top:0em;">)</span></span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:0.68333em;vertical-align:0em;"></span><span class="mord mathdefault">n</span><span class="mord mathdefault" style="margin-right:0.00773em;">R</span><span class="mord mathdefault" style="margin-right:0.13889em;">T</span></span></span></span></span></p>\n<h2>Sine Definition as an Infinite Series</h2>\n<p><span class="katex-display"><span class="katex"><span class="katex-mathml">sin⁡x=∑n=1∞(−1)n−1x2n−1(2n−1)!\\sin x = \\sum\\limits_{n = 1}^\\infty  {\\frac{{\\left( { - 1} \\right)^{n - 1} x^{2n - 1} }}{{\\left( {2n - 1} \\right)!}}}</span><span class="katex-html"><span class="base"><span class="strut" style="height:0.66786em;vertical-align:0em;"></span><span class="mop">sin</span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord mathdefault">x</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:2.9185100000000004em;vertical-align:-1.267113em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.6513970000000002em;"><span style="top:-1.882887em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">n</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.050005em;"><span class="pstrut" style="height:3.05em;"></span><span><span class="mop op-symbol large-op">∑</span></span></span><span style="top:-4.3000050000000005em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">∞</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.267113em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.631008em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord"><span class="mord">2</span><span class="mord mathdefault">n</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222222222222222em;"></span><span class="mord">1</span></span><span class="mclose delimcenter" style="top:0em;">)</span></span><span class="mclose">!</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"><span class="minner"><span class="minner"><span class="mopen delimcenter" style="top:0em;">(</span><span class="mord"><span class="mord">−</span><span class="mord">1</span></span><span class="mclose delimcenter" style="top:0em;">)</span></span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.954008em;"><span style="top:-3.2029em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathdefault mtight">n</span><span class="mbin mtight">−</span><span class="mord mtight">1</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.16666666666666666em;"></span><span class="mord"><span class="mord mathdefault">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span><span class="mord mathdefault mtight">n</span><span class="mbin mtight">−</span><span class="mord mtight">1</span></span></span></span></span></span></span></span></span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></span></p>'}]);
                done();
            });
        });

        it('article-content 2 - should return 200 with content of article', done => {
            request(app.app).get('/api/article-content/2').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 2, content: '<h1>yes</h1>'}]);
                done();
            });
        });


        it('article-content 3 - should return 200 with content of article', done => {
            request(app.app).get('/api/article-content/3').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 3, content: '<h1>yes</h1>'}]);
                done();
            });
        });

        it('article-content 4 - should return 200 with content of article', done => {
            request(app.app).get('/api/article-content/4').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 4, content: '<h1>yes</h1>'}]);
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
            it('unit 4, by id, query for unit - should return 404', done => {
                request(app.app).get('/api/parent?want=unit&unit=4').expect(404, done);
            });
            it('unit 4, by name, query for unit - should return 404', done => {
                request(app.app).get('/api/parent?want=unit&unit=03-intro-to-cells').expect(404, done);
            });

            it('unit 5 (nonexistent), by id - should return 404', done => {
                request(app.app).get('/api/parent?want=subject&unit=5').expect(404, done);
            });

            it('unit 5 (nonexistent), by name - should return 404', done => {
                request(app.app).get('/api/parent?want=subject&article=thisunitdoesnotexist').expect(404, done);
            });
        });

        describe('query by course', () => {
            it('course 1, by id, query for subject - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=subject&course=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'mathematics', display_name: 'Mathematics', description: 'Mathematics (from Greek ?????? máth?ma, "knowledge, study, learning") includes the study of such topics as quantity, structure, space, and change.', color: '3f73d9'}]);
                    done();
                });
            });
            it('course 1, by name, query for subject - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=subject&course=differential-calculus').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, name: 'mathematics', display_name: 'Mathematics', description: 'Mathematics (from Greek ?????? máth?ma, "knowledge, study, learning") includes the study of such topics as quantity, structure, space, and change.', color: '3f73d9'}]);
                    done();
                });
            });
            it('course 1, by id, query for course - should return 404', done => {
                request(app.app).get('/api/parent?want=course&course=1').expect(404, done);
            });
            it('course 1, by name, query for course - should return 404', done => {
                request(app.app).get('/api/parent?want=course&course=differential-calculus').expect(404, done);
            });

            it('course 3, by id, query for subject - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=subject&course=3').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 2, name: 'biology', display_name: 'Biology', description: 'wowie isn\'t biology fun', color: 'd13692'}]);
                    done();
                });
            });
            it('course 3, by name, query for subject - should return 200 with query result', done => {
                request(app.app).get('/api/parent?want=subject&course=cells').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 2, name: 'biology', display_name: 'Biology', description: 'wowie isn\'t biology fun', color: 'd13692'}]);
                    done();
                });
            });
            it('course 3, by id, query for course - should return 404', done => {
                request(app.app).get('/api/parent?want=course&course=3').expect(404, done);
            });
            it('course 3, by name, query for course - should return 404', done => {
                request(app.app).get('/api/parent?want=course&course=cells').expect(404, done);
            });

            it('course 5 (nonexistent), by id - should return 404', done => {
                request(app.app).get('/api/parent?want=subject&course=5').expect(404, done);
            });

            it('course 5 (nonexistent), by name - should return 404', done => {
                request(app.app).get('/api/parent?want=subject&course=thiscoursedoesnotexist').expect(404, done);
            });
        });
    });
});

after('close server', () => {
    app.server.close();
});
