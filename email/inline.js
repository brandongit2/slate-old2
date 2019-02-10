const fs = require('fs');
const inlineCss = require('inline-css');
const rimraf = require('rimraf');

rimraf('./dist/**/*', err => {
    if (err) console.log(err);
});

fs.readFile('./src/index.html', 'utf8', (err, data) => {
    if (err) console.log(err);

    inlineCss(data, {
        removeLinkTags: false,
        url:            'http://localhost:8080'
    }).then(html => {
        fs.writeFile('./dist/index.html', html, 'utf8', err => {
            if (err) console.log(err);
        });
    });
});
