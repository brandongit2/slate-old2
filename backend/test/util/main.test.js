const assert = require('chai').assert;
const util = require('../../src/util');

describe('Util.js', () => {
    describe('#genToken()', () => {
        it('length of 4', async () => {
            const token = await util.genToken(4);
            assert.isNotNull(token);
            assert.equal(token.length, 4);
        });
        it('length of 8', async () => {
            const token = await util.genToken(8);
            assert.isNotNull(token);
            assert.equal(token.length, 8);
        });
        it('length of 16', async () => {
            const token = await util.genToken(16);
            assert.isNotNull(token);
            assert.equal(token.length, 16);
        });
    });
    describe('#parseContent()', () => {
        it('should surround with <p> tags', () => {
            const parsed = util.parseContent('Test');
            assert.equal(parsed, '<p>Test</p>');
        });
        it('only allowed tags - no change', () => {
            const parsed = util.parseContent('<div><h1>Test</h1><p>Testing paragraph</p></div>');
            assert.equal(parsed, '<div><h1>Test</h1><p>Testing paragraph</p></div>');
        });
        it('remove not allowed attributes', () => {
            const parsed = util.parseContent('<div test=true><h1 test2="test">Test</h1><p>Testing paragraph</p></div>');
            assert.equal(parsed, '<div><h1>Test</h1><p>Testing paragraph</p></div>');
        });
    });
});
