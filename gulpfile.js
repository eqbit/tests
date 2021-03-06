const {src, dest, watch, parallel} = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const browsersync = require("browser-sync").create();
const fileinclude = require('gulp-file-include');

const browserSync = done => {
  browsersync.init({
    server: {
      baseDir: "./build/",
      tunnel: true
    },
    port: 3000
  });
  done();
};

const scripts = () => {
  return src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      // presets: [['@babel/preset-env']],
      // plugins: [['@babel/transform-runtime']]
    }))
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'))
    .pipe(browsersync.stream());
  
};

const generateHtml = () => {
  return src([
    'src/html/**',
    '!src/html/components/**'
  ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('build'))
    .pipe(browsersync.stream());
};


const watcher = () => {
  watch('src/js/*.js', scripts);
  watch('src/html/**/*.html', generateHtml);
};

exports.js = scripts;
exports.html = generateHtml;
exports.watch = parallel(watcher, browserSync);
exports.build = parallel(scripts, generateHtml);