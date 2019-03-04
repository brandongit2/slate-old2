const withProgressBar = require('next-progressbar');
const withSass = require('@zeit/next-sass');

const versionInfo = require('./version.json');

module.exports = withProgressBar(withSass({
    cssModules:  true,
    progressBar: {
        profile: true
    },
    cssLoaderOptions: {
        importLoaders:  1,
        localIdentName: '[local]___[hash:base64:5]',
    },
    
    env: {
        ...versionInfo
    }
}));
