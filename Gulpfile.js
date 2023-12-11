const gulp = require('gulp');
const include = require('gulp-file-include');
const server = require('browser-sync').create();
const { watch, series } = require('gulp');

const PATH = {
    SRC: './src',
    SRC_HTML: './src/pages/**/*.html',
    SRC_ASSETS: `./src/assets/**/*`,
    DIST: './dist'
}

async function reload() {
  server.reload();
}

function buildStyles() {
  return gulp.src(`${PATH.SRC}/scss/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${PATH.DIST}/assets/styles`));
};

async function buildAssets() {
  gulp.src([PATH.SRC_ASSETS])
    .pipe(gulp.dest(PATH.DIST));
}

async function buildHTML() {
  gulp.src([PATH.SRC_HTML])
        // include partials
        .pipe(include({
          prefix: '@',
          basepath: 'src/includes'
        }))
        .pipe(gulp.dest(PATH.DIST));
}

exports.default = async function() {
  buildHTML();
  buildAssets();
  buildStyles();
  
  server.init({
    server: {
      baseDir: PATH.DIST
    }
  });

  watch([`${PATH.SRC}/**/*`], series(buildHTML, buildAssets, buildStyles, reload));
};

// clean directories
const clean = require('gulp-clean');
exports.clean = function () {
  return gulp.src([PATH.DIST], { read: false, allowEmpty: true })
  .pipe(clean());
}

// build sass
const sass = require('gulp-sass')(require('sass'));
exports.buildStyles = buildStyles;