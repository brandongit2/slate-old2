const assert = require('chai').assert;
const request = require('supertest');

const app = require('../../src/server');

describe('data functions', () => {
    describe('/api/all-subjects', () => {
        it.skip('should return 200 with all subjects', done => {
            request(app.app).get('/api/all-subjects').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, name: 'mathematics', display_name: 'Mathematics', description: 'Mathematics (from Greek μάθημα máthēma, "knowledge, study, learning") includes the study of such topics as quantity, structure, space, and change.', color: '3f73d9'}, {id: 2, name: 'biology', display_name: 'Biology', description: 'wowie isn\'t biology fun', color: 'd13692'}, {id: 3, name: 'chemistry', display_name: 'Chemistry', description: 'Chemistry is the scientific discipline involved with elements and compounds composed of atoms, molecules and ions: their composition, structure, properties, behavior and the changes they undergo during a reaction with other substances.', color: 'eae02c'}]);
                done();
            });
        });
    });

    describe('/api/subject/:id', () => {
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

    describe('/api/all-courses', () => {
        it('should return 200 with all courses', done => {
            request(app.app).get('/api/all-courses').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, subject_id: 1, name: 'differential-calculus', display_name: 'Differential calculus', description: 'haha calculus'}, {id: 3, subject_id: 2, name: 'cells', display_name: 'Cells', description: 'cells are pretty cool!'}, {id: 2, subject_id: 1, name: 'integral-calculus', display_name: 'Integral calculus', description: 'finding area under curves, antiderivatives, etc.'}]);
                done();
            });
        });
    });

    describe('/api/course/:id', () => {
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

    describe('/api/all-units', () => {
        it('should return 200 with all courses', done => {
            request(app.app).get('/api/all-units').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, name: '01-slopes-of-secant-and-tangent-lines', display_name: 'Slopes of secant and tangent lines', course_id: 1, description: 'Find the slopes of lines intersecting functions.'}, {id: 3, name: '02-the-fundamental-theorem-of-calculus', display_name: 'The fundamental theorem of calculus', course_id: 2, description: 'yeah'}, {id: 4, name: '03-intro-to-cells', display_name: 'Intro to cells', course_id: 3, description: 'introduction to cells'}, {id: 2, name: '01-limits', display_name: 'Limits', course_id: 1, description: 'One of the most important aspects of calculus.'}]);
                done();
            });
        });
    });

    describe('/api/unit/:id', () => {
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

    describe('/api/all-articles', () => {
        it('should return 200 with all articles', done => {
            request(app.app).get('/api/all-articles').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, title: '01-slope-review', display_title: 'Slope Review', unit_id: 1, publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z'}, {id: 3, title: '02-intro-to-limits', display_title: 'Intro to Limits', unit_id: 2, publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z'}, {id: 4, title: '03-the-fundamental-theorem-of-calculus-part-1', display_title: 'The Fundamental Theorem of Calculus, part 1', unit_id: 3, publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z'}, {id: 2, title: '01-secant-lines', display_title: 'Secant Lines', unit_id: 1, publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z'}]);
                done();
            });
        });
    });

    describe('/api/article/:id', () => {
        it('article 1 - should return 200 with description of article', done => {
            request(app.app).get('/api/article/1').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 1, order: 1, title: '01-slope-review', display_title: 'Slope Review', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 1}]);
                done();
            });
        });

        it('article 2 - should return 200 with description of article', done => {
            request(app.app).get('/api/article/2').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 2, order: 2, title: '01-secant-lines', display_title: 'Secant Lines', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 1}]);
                done();
            });
        });

        it('article 3 - should return 200 with description of article', done => {
            request(app.app).get('/api/article/3').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 3, order: 1, title: '02-intro-to-limits', display_title: 'Intro to Limits', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 2}]);
                done();
            });
        });

        it('article 4 - should return 200 with description of article', done => {
            request(app.app).get('/api/article/4').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.body, [{id: 4, order: 1, title: '03-the-fundamental-theorem-of-calculus-part-1', display_title: 'The Fundamental Theorem of Calculus, part 1', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 3}]);
                done();
            });
        });

        it('article 5 (nonexistent) - should return 404', done => {
            request(app.app).get('/api/article/5').expect(404, done);
        });
    });

    describe('/api/article-content/:id', () => {
        it('article-content 1 - should return 200 with content of article', done => {
            request(app.app).get('/api/article-content/1').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.text.length, 81408);
                done();
            });
        });

        it('article-content 2 - should return 200 with content of article', done => {
            request(app.app).get('/api/article-content/2').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.text, '<h1>yes</h1>');
                done();
            });
        });

        it('article-content 3 - should return 200 with content of article', done => {
            request(app.app).get('/api/article-content/3').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.text, '<h1>yes</h1>');
                done();
            });
        });

        it('article-content 4 - should return 200 with content of article', done => {
            request(app.app).get('/api/article-content/4').expect(200).end((err, res) => {
                if (err) throw err;
                assert.deepEqual(res.text, '<h1>yes</h1>');
                done();
            });
        });

        it('article-content 5 (nonexistent) - should return 404', done => {
            request(app.app).get('/api/article-content/5').expect(404, done);
        });
    });

    describe('/api/parent', () => {
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

            it('unit 1, by id, query for unit - should return 400', done => {
                request(app.app).get('/api/parent?want=unit&unit=1').expect(400, done);
            });

            it('unit 1, by name, query for unit - should return 400', done => {
                request(app.app).get('/api/parent?want=unit&unit=01-slopes-of-secant-and-tangent-lines').expect(400, done);
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

            it('unit 4, by id, query for unit - should return 400', done => {
                request(app.app).get('/api/parent?want=unit&unit=4').expect(400, done);
            });

            it('unit 4, by name, query for unit - should return 400', done => {
                request(app.app).get('/api/parent?want=unit&unit=03-intro-to-cells').expect(400, done);
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

    describe('/api/children', () => {
        describe('query by subject', () => {
            it('subject 1, by id, no want specified - should return 200 with query result', done => {
                request(app.app).get('/api/children?subject=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [
                        {id: 1, order: 1, name: 'differential-calculus', display_name: 'Differential calculus', subject_id: 1, description: 'haha calculus'},
                        {id: 2, order: 2, name: 'integral-calculus', display_name: 'Integral calculus', subject_id: 1, description: 'finding area under curves, antiderivatives, etc.'}
                    ]);
                    done();
                });
            });

            it('subject 1, by name, no want specified - should return 200 with query result', done => {
                request(app.app).get('/api/children?subject=mathematics').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [
                        {id: 1, order: 1, name: 'differential-calculus', display_name: 'Differential calculus', subject_id: 1, description: 'haha calculus'},
                        {id: 2, order: 2, name: 'integral-calculus', display_name: 'Integral calculus', subject_id: 1, description: 'finding area under curves, antiderivatives, etc.'}
                    ]);
                    done();
                });
            });

            it('subject 1, by id, want courses - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=courses&subject=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [
                        {id: 1, order: 1, name: 'differential-calculus', display_name: 'Differential calculus', subject_id: 1, description: 'haha calculus'},
                        {id: 2, order: 2, name: 'integral-calculus', display_name: 'Integral calculus', subject_id: 1, description: 'finding area under curves, antiderivatives, etc.'}
                    ]);
                    done();
                });
            });

            it('subject 1, by name, want courses - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=courses&subject=mathematics').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [
                        {id: 1, order: 1, name: 'differential-calculus', display_name: 'Differential calculus', subject_id: 1, description: 'haha calculus'},
                        {id: 2, order: 2, name: 'integral-calculus', display_name: 'Integral calculus', subject_id: 1, description: 'finding area under curves, antiderivatives, etc.'}
                    ]);
                    done();
                });
            });

            it('subject 1, by id, want units - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=units&subject=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, name: '01-slopes-of-secant-and-tangent-lines', display_name: 'Slopes of secant and tangent lines', description: 'Find the slopes of lines intersecting functions.', course_id: 1}, {id: 2, order: 2, name: '01-limits', display_name: 'Limits', description: 'One of the most important aspects of calculus.', course_id: 1}, {id: 3, order: 1, name: '02-the-fundamental-theorem-of-calculus', display_name: 'The fundamental theorem of calculus', description: 'yeah', course_id: 2}]);
                    done();
                });
            });

            it('subject 1, by name, want units - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=units&subject=mathematics').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, name: '01-slopes-of-secant-and-tangent-lines', display_name: 'Slopes of secant and tangent lines', description: 'Find the slopes of lines intersecting functions.', course_id: 1}, {id: 2, order: 2, name: '01-limits', display_name: 'Limits', description: 'One of the most important aspects of calculus.', course_id: 1}, {id: 3, order: 1, name: '02-the-fundamental-theorem-of-calculus', display_name: 'The fundamental theorem of calculus', description: 'yeah', course_id: 2}]);
                    done();
                });
            });

            it('subject 1, by id, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&subject=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, title: '01-slope-review', display_title: 'Slope Review', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 1}, {id: 2, order: 2, title: '01-secant-lines', display_title: 'Secant Lines', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 1}, {id: 3, order: 1, title: '02-intro-to-limits', display_title: 'Intro to Limits', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 2}, {id: 4, order: 1, title: '03-the-fundamental-theorem-of-calculus-part-1', display_title: 'The Fundamental Theorem of Calculus, part 1', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 3}]);
                    done();
                });
            });

            it('subject 1, by name, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&subject=mathematics').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, title: '01-slope-review', display_title: 'Slope Review', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 1}, {id: 2, order: 2, title: '01-secant-lines', display_title: 'Secant Lines', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 1}, {id: 3, order: 1, title: '02-intro-to-limits', display_title: 'Intro to Limits', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 2}, {id: 4, order: 1, title: '03-the-fundamental-theorem-of-calculus-part-1', display_title: 'The Fundamental Theorem of Calculus, part 1', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 3}]);
                    done();
                });
            });

            it('subject 1, by id, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subject&subject=1').expect(400, done);
            });

            it('subject 1, by name, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subject&subject=mathematics').expect(400, done);
            });

            it('subject 2, by id, no want specified - should return 200 with query result', done => {
                request(app.app).get('/api/children?subject=2').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 3, order: 1, name: 'cells', display_name: 'Cells', subject_id: 2, description: 'cells are pretty cool!'}]);
                    done();
                });
            });

            it('subject 2, by name, no want specified - should return 200 with query result', done => {
                request(app.app).get('/api/children?subject=biology').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 3, order: 1, name: 'cells', display_name: 'Cells', subject_id: 2, description: 'cells are pretty cool!'}]);
                    done();
                });
            });

            it('subject 2, by id, want courses - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=courses&subject=2').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 3, order: 1, name: 'cells', display_name: 'Cells', subject_id: 2, description: 'cells are pretty cool!'}]);
                    done();
                });
            });

            it('subject 2, by name, want courses - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=courses&subject=biology').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 3, order: 1, name: 'cells', display_name: 'Cells', subject_id: 2, description: 'cells are pretty cool!'}]);
                    done();
                });
            });

            it('subject 2, by id, want units - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=units&subject=2').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 4, order: 1, name: '03-intro-to-cells', display_name: 'Intro to cells', description: 'introduction to cells', course_id: 3}]);
                    done();
                });
            });

            it('subject 2, by name, want units - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=units&subject=biology').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 4, order: 1, name: '03-intro-to-cells', display_name: 'Intro to cells', description: 'introduction to cells', course_id: 3}]);
                    done();
                });
            });

            it('subject 2, by id, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&subject=2').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('subject 2, by name, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&subject=biology').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('subject 2, by id, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subject&subject=2').expect(400, done);
            });

            it('subject 2, by name, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subject&subject=biology').expect(400, done);
            });

            it('subject 3, by id, no want query - should return 200 with query result', done => {
                request(app.app).get('/api/children?subject=3').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('subject 3, by name, no want query - should return 200 with query result', done => {
                request(app.app).get('/api/children?subject=chemistry').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('subject 3, by id, want courses - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=courses&subject=3').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('subject 3, by name, want courses - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=courses&subject=chemistry').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('subject 3, by id, want units - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=units&subject=3').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('subject 3, by name, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&subject=chemistry').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('subject 3, by id, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&subject=3').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('subject 3, by name, want units - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=units&subject=chemistry').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('subject 3, by id, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subject&subject=3').expect(400, done);
            });

            it('subject 3, by name, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subject&subject=chemistry').expect(400, done);
            });

            it('subject 4 (nonexistent), by id - should return 200 with empty array', done => {
                request(app.app).get('/api/children?subject=4').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('subject 4 (nonexistent), by name - should return 200 with empty array', done => {
                request(app.app).get('/api/children?subject=nonexistantsubject').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });
        });

        describe('query by course', () => {
            it('course 1, by id, no want specified - should return 200 with query result', done => {
                request(app.app).get('/api/children?course=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, name: '01-slopes-of-secant-and-tangent-lines', display_name: 'Slopes of secant and tangent lines', course_id: 1, description: 'Find the slopes of lines intersecting functions.'}, {id: 2, order: 2, name: '01-limits', display_name: 'Limits', course_id: 1, description: 'One of the most important aspects of calculus.'}]);
                    done();
                });
            });

            it('course 1, by name, no want specified - should return 200 with query result', done => {
                request(app.app).get('/api/children?course=differential-calculus').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, name: '01-slopes-of-secant-and-tangent-lines', display_name: 'Slopes of secant and tangent lines', course_id: 1, description: 'Find the slopes of lines intersecting functions.'}, {id: 2, order: 2, name: '01-limits', display_name: 'Limits', course_id: 1, description: 'One of the most important aspects of calculus.'}]);
                    done();
                });
            });

            it('course 1, by id, want units - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=units&course=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, name: '01-slopes-of-secant-and-tangent-lines', display_name: 'Slopes of secant and tangent lines', course_id: 1, description: 'Find the slopes of lines intersecting functions.'}, {id: 2, order: 2, name: '01-limits', display_name: 'Limits', course_id: 1, description: 'One of the most important aspects of calculus.'}]);
                    done();
                });
            });

            it('course 1, by name, want units - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=units&course=differential-calculus').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, name: '01-slopes-of-secant-and-tangent-lines', display_name: 'Slopes of secant and tangent lines', course_id: 1, description: 'Find the slopes of lines intersecting functions.'}, {id: 2, order: 2, name: '01-limits', display_name: 'Limits', course_id: 1, description: 'One of the most important aspects of calculus.'}]);
                    done();
                });
            });

            it('course 1, by id, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&course=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, title: '01-slope-review', display_title: 'Slope Review', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 1}, {id: 2, order: 2, title: '01-secant-lines', display_title: 'Secant Lines', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 1}, {id: 3, order: 1, title: '02-intro-to-limits', display_title: 'Intro to Limits', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 2}]);
                    done();
                });
            });

            it('course 1, by name, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&course=differential-calculus').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, title: '01-slope-review', display_title: 'Slope Review', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 1}, {id: 2, order: 2, title: '01-secant-lines', display_title: 'Secant Lines', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 1}, {id: 3, order: 1, title: '02-intro-to-limits', display_title: 'Intro to Limits', publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z', unit_id: 2}]);
                    done();
                });
            });

            it('course 1, by id, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subjects&course=1').expect(400, done);
            });

            it('course 1, by name, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subjects&course=differential-calculus').expect(400, done);
            });

            it('course 3, by id, no want specified - should return 200 with query result', done => {
                request(app.app).get('/api/children?course=3').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 4, order: 1, name: '03-intro-to-cells', display_name: 'Intro to cells', course_id: 3, description: 'introduction to cells'}]);
                    done();
                });
            });

            it('course 3, by name, no want specified - should return 200 with query result', done => {
                request(app.app).get('/api/children?course=cells').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 4, order: 1, name: '03-intro-to-cells', display_name: 'Intro to cells', course_id: 3, description: 'introduction to cells'}]);
                    done();
                });
            });

            it('course 3, by id, want units - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=units&course=3').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 4, order: 1, name: '03-intro-to-cells', display_name: 'Intro to cells', course_id: 3, description: 'introduction to cells'}]);
                    done();
                });
            });

            it('course 3, by name, want units - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=units&course=cells').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 4, order: 1, name: '03-intro-to-cells', display_name: 'Intro to cells', course_id: 3, description: 'introduction to cells'}]);
                    done();
                });
            });

            it('course 3, by id, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&course=3').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('course 3, by name, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&course=cells').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('course 3, by id, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subjects&course=3').expect(400, done);
            });

            it('course 3, by name, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subjects&course=cells').expect(400, done);
            });

            it('course 4 (nonexistent), by id - should return 200 with empty array', done => {
                request(app.app).get('/api/children?course=4').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('course 4(nonexistent), by name - should return 200 with empty array', done => {
                request(app.app).get('/api/children?course=nonexistantcourse').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });
        });

        describe('query by unit', () => {
            it('unit 1, by id, no want specified - should return 200 with query result', done => {
                request(app.app).get('/api/children?unit=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, title: '01-slope-review', display_title: 'Slope Review', unit_id: 1, publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z'}, {id: 2, order: 2, title: '01-secant-lines', display_title: 'Secant Lines', unit_id: 1, publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z'}]);
                    done();
                });
            });

            it('unit 1, by name, no want specified - should return 200 with query result', done => {
                request(app.app).get('/api/children?unit=01-slopes-of-secant-and-tangent-lines').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, title: '01-slope-review', display_title: 'Slope Review', unit_id: 1, publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z'}, {id: 2, order: 2, title: '01-secant-lines', display_title: 'Secant Lines', unit_id: 1, publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z'}]);
                    done();
                });
            });

            it('unit 1, by id, want want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&unit=1').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, title: '01-slope-review', display_title: 'Slope Review', unit_id: 1, publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z'}, {id: 2, order: 2, title: '01-secant-lines', display_title: 'Secant Lines', unit_id: 1, publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z'}]);
                    done();
                });
            });

            it('unit 1, by name, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&unit=01-slopes-of-secant-and-tangent-lines').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, [{id: 1, order: 1, title: '01-slope-review', display_title: 'Slope Review', unit_id: 1, publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z'}, {id: 2, order: 2, title: '01-secant-lines', display_title: 'Secant Lines', unit_id: 1, publish_date: '2019-03-11T02:54:13.000Z', update_date: '2019-03-11T02:54:26.000Z'}]);
                    done();
                });
            });

            it('unit 1, by id, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subjects&unit=1').expect(400, done);
            });

            it('unit 1, by name, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subjects&unit=01-slopes-of-secant-and-tangent-lines').expect(400, done);
            });

            it('unit 4, by id, no want specified - should return 200 with query result', done => {
                request(app.app).get('/api/children?unit=4').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('unit 4, by name, no want specified - should return 200 with query result', done => {
                request(app.app).get('/api/children?unit=03-intro-to-cells').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('unit 4, by id, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&unit=4').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('unit 4, by name, want articles - should return 200 with query result', done => {
                request(app.app).get('/api/children?want=articles&unit=03-intro-to-cells').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('unit 4, by id, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subjects&unit=4').expect(400, done);
            });

            it('unit 4, by name, bad want query - should return 400', done => {
                request(app.app).get('/api/children?want=subjects&unit=03-intro-to-cells').expect(400, done);
            });

            it('unit 5 (nonexistent), by id - should return 200 with empty array', done => {
                request(app.app).get('/api/children?unit=5').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });

            it('unit 5 (nonexistent), by name - should return 200 with empty array', done => {
                request(app.app).get('/api/children?unit=nonexistantunit').expect(200).end((err, res) => {
                    if (err) throw err;
                    assert.deepEqual(res.body, []);
                    done();
                });
            });
        });
    });
});

after('close server', () => {
    app.server.close();
});
