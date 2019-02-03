const {src, dest, parallel} = require('gulp');
const babel = require('gulp-babel');

const srcDir = 'src/';
const buildDir = 'build/';

function transpileJs() {
    return src(srcDir + '*.js')
        .pipe(babel())
        .pipe(dest(buildDir));
}

function moveJson() {
    return src(srcDir + '*.json')
        .pipe(dest(buildDir));
}

exports.default = parallel(transpileJs, moveJson);
