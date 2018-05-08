var concat = require('gulp-concat');
var rename = require('gulp-rename');
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var flatten = require('gulp-flatten');
var nodemon = require('gulp-nodemon');
var Server = require('karma').Server;
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-clean-css');
var browserify = require('browserify');
var tsify = require('tsify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserifyInc = require('browserify-incremental');
var uglify = require('gulp-uglify');

gulp.task('sass', function () {
  return gulp.src(['src/app/scss/metronic/theme/style.scss', 'src/app/scss/metronic/framework/vendors/bootstrap/bootstrap.scss', 'src/app/scss/styles.scss'])
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .on('error', swallowError)
    .pipe(flatten())
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulp.dest('build/app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('html', function () {
  return gulp.src("src/app/**/*.html")
    .pipe(gulp.dest('build/app/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('pug', function () {
  gulp.src("src/app/**/*.pug")
    .pipe(gulp.dest('build/app/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('png', function () {
  gulp.src("src/app/images/**/*.png")
    .pipe(gulp.dest('build/app/images'));
});

gulp.task('jpg', function () {
  gulp.src("src/app/images/**/*.jpg")
    .pipe(gulp.dest('build/app/images'));
});

gulp.task('ttf', function () {
  gulp.src("src/app/scss/**.ttf")
    .pipe(gulp.dest('build/app/css'));
});

gulp.task('woff', function () {
  gulp.src("src/app/scss/**.woff")
    .pipe(gulp.dest('build/app/css'));
});

gulp.task('eot', function () {
  gulp.src("src/app/scss/**.eot")
    .pipe(gulp.dest('build/app/css'));
});

gulp.task('angular2Libs', function () {
  return browserify({
      entries: [
        'node_modules/core-js/client/shim.min.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js'
      ]
    })
    .bundle()
    .pipe(source('vendors.js'))
    .pipe(gulp.dest('build/app'));
});

gulp.task('mainScripts', function () {
  var b = browserify({
    basedir: '.',
    debug: true,
    entries: ['src/app/main.ts'],
    cache: {},
    packageCache: {}
  });
  browserifyInc(b, {
    cacheFile: './browserify-cache.json'
  });
  b.plugin(tsify)
    .on('error', swallowError)
  b.bundle()
    .on('error', swallowError)
    .pipe(source('main.js'))
    .pipe(gulp.dest("build/app/"))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('productionMainScripts', function () {
  var b = browserify({
    basedir: '.',
    debug: true,
    entries: ['src/app/main.ts'],
    cache: {},
    packageCache: {}
  });
  browserifyInc(b, {
    cacheFile: './browserify-cache.json'
  });
  b.plugin(tsify)
    .on('error', swallowError)
  b.bundle()
    .on('error', swallowError)
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("build/app/"))
});

gulp.task('browserSync', ['nodemon'], function () {
  setTimeout(function () {
    browserSync.init({
      proxy: "http://localhost:4444", // port of node server,
      port: 7000
    })
  }, 1500);
});

gulp.task('nodemon', function (cb) {
  var started = false;
  return nodemon({
    script: 'start.js'
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('watch', ['browserSync'], function () {
  gulp.watch('src/app/**/*.scss', ['sass']),
    gulp.watch('src/app/**/*.html', ['html']),
    gulp.watch('src/app/**/*.pug', ['pug']),
    gulp.watch('src/app/**/*.ts', ['mainScripts']),
    gulp.watch('src/app/images/*.png', ['png']);
  gulp.watch('src/app/images/*.jpg', ['jpg']);
  gulp.watch('src/app/scss/*.ttf', ['ttf']);
  gulp.watch('src/app/scss/*.woff', ['woff']);
  gulp.watch('src/app/scss/*.eot', ['eot']);
});

gulp.task('nodemonDebug', function (cb) {
  var started = false;
  return nodemon({
    script: 'start.js',
    nodeArgs: ['--inspect=9229', '--inspect-brk']
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('build', ['mainScripts', 'angular2Libs', 'sass', 'html', 'pug', 'png', 'jpg', 'ttf', 'woff', 'eot'], function () {
  return gulp.src(['src/app/**/*.html', 'src/app/**/*.pug'])
    .pipe(useref())
    .pipe(gulp.dest('build/app'));
});

gulp.task('productionBuild', ['productionMainScripts', 'angular2Libs', 'sass', 'html', 'pug', 'png', 'jpg', 'ttf', 'woff', 'eot'], function () {
  return gulp.src(['src/app/**/*.html', 'src/app/**/*.pug'])
    .pipe(useref())
    .pipe(gulp.dest('build/app'));
});


gulp.task('default', ['watch']);

gulp.task('debug', ['nodemonDebug']);

gulp.task('test', ['karmaWatch']);