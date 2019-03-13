const request = require('supertest');

const app = require('../../src/server');

describe('Slate API', () => {
    require('./data.test');
    require('./settings.test');
    require('./user.test');
    require('./util.test');
    
    describe('misc functions', () => {
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
    });
    
    after('close server', () => {
        app.server.close();
    });
});
