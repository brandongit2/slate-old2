const {src, dest, parallel, series} = require('gulp');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const jsonminify = require('gulp-jsonminify');
const uglify = require('gulp-uglify');

const srcDir = 'src/';
const buildDir = 'build/';

function cleanDir() {
    return src(buildDir, {read: false})
        .pipe(clean());
}

function transpileJs() {
    return src(srcDir + '*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(dest(buildDir));
}

function moveJson() {
    return src(srcDir + '*.json')
        .pipe(jsonminify())
        .pipe(dest(buildDir));
}

exports.default = series(cleanDir, parallel(transpileJs, moveJson));
