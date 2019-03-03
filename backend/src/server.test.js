const request = require('supertest');
const app = require('./server');

describe('Slate API', function() {
    describe('/api', () => {
        interface('should return 200', (done) => {
            request(app).get('/api').expect(200, done);
        })
    });
});

