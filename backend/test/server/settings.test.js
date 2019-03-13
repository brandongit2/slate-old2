const assert = require('chai').assert;
const request = require('supertest');

const app = require('../../src/server');

describe('settings functions', () => {
    describe('/api/settings/toggle-theme', () => {
        it('should return 200 and toggle theme', done => {
            request(app.app).post('/api/authenticate').set('Cookie', ['authToken=Ayudf3AojGxYr121']).expect(200).end(async (err, res) => {
                if (err) throw err;
                assert.equal(res.body.user.theme, 'light');
                await request(app.app).post('/api/settings/toggle-theme').set('Cookie', ['authToken=Ayudf3AojGxYr121']).expect(200);

                request(app.app).post('/api/authenticate').set('Cookie', ['authToken=Ayudf3AojGxYr121']).expect(200).end(async (err, res) => {
                    if (err) throw err;
                    assert.equal(res.body.user.theme, 'dark');
                    await request(app.app).post('/api/settings/toggle-theme').set('Cookie', ['authToken=Ayudf3AojGxYr121']).expect(200);

                    request(app.app).post('/api/authenticate').set('Cookie', ['authToken=Ayudf3AojGxYr121']).expect(200).end((err, res) => {
                        if (err) throw err;
                        assert.equal(res.body.user.theme, 'light');
                        done();
                    });
                });
            });
        });
    });
});

after('close server', () => {
    app.server.close();
});
