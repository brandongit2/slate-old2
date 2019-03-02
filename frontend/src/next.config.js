const withSass = require('@zeit/next-sass');

const versionInfo = require('../version.json');

module.exports = withSass({
    cssModules: true,
    
    env: {
        ...versionInfo
    }
});
