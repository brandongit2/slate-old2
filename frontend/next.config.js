const withProgressBar = require('next-progressbar');
const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

const config = require('./config.json');
const versionInfo = require('./version.json');

module.exports = withProgressBar(withSass({
    ...withCss({
        progressBar: {
            profile: true
        },
        
        env: {
            ...config,
            ...versionInfo
        }
    }),
    cssModules:       true,
    cssLoaderOptions: {
        importLoaders:  1,
        localIdentName: '[local]___[hash:base64:5]',
    },
}));
