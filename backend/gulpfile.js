const {src, dest, parallel, series} = require('gulp');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

const srcDir = 'src/';
const buildDir = 'build/';

function cleanDir() {
    return src(buildDir, {read: false})
        .pipe(clean());
}

function transpileJs() {
    return src(srcDir + '**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write())
        .pipe(dest(buildDir));
}

function moveJson() {
    return src(srcDir + '**/*.json')
        .pipe(dest(buildDir));
}

exports.default = series(cleanDir, parallel(transpileJs, moveJson));
