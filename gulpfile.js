'use strict';

const gulp        = require('gulp');
const uglify      = require('gulp-uglify');
const es          = require('event-stream');
const del         = require('del');
const minimist    = require('minimist');
const browserSync = require('browser-sync');
const gulpif      = require('gulp-if');
const babel       = require('gulp-babel');
const browserify  = require('gulp-browserify');
const sourcemaps  = require('gulp-sourcemaps');
const plumber     = require('gulp-plumber');
const notifier    = require('node-notifier');

function onError(err) {
  console.error(err);
  notifier.notify({title: 'Ошибка', message: err.message});
}

var settings = {
  type:     null,           // Тип билда (для настроек и фильтрации файлов)
  dest:     'dest',         // Директоря для билда
  jsmin:    true,           // Минификация js
  cssmin:   true,           // Минификация css
  htmlmin:  true,           // Минификация html
  notify:   false,          // Показывать уведомления
  context:  null,           // Контекст для gulp-preprocess
  templatesSrc: ['app/templates/**/*.html'],
  stylesSrc: ['app/styles/**/*.css'],
  htmlSrc: [
    {src: ['app/*.html'], dest: ''},
    {src: ['app/views/**/*.html'], dest: 'views'}
  ]
};

/**
 * Настройки опций консоли
 */
var knownOptions = {
  'string': ['target', 'type'],
  'boolean': ['jsmin', 'cssmin', 'htmlmin', 'notify'],
  'default': { target: 'local', jsmin: true, cssmin: true, htmlmin: true, notify: false}
};


// Считываем консольные параметры
var cmdOptions = minimist(process.argv.slice(2), knownOptions);

try {
  settings.jsmin = cmdOptions.jsmin;
  settings.cssmin = cmdOptions.cssmin;
  settings.htmlmin = cmdOptions.htmlmin;

  console.log('Type: ' + settings.type, 'Target: ' + cmdOptions.target);

  if (cmdOptions._.indexOf('serve') !== -1) {
    settings.dest = '.tmp';
  }
  console.log(settings.dest);
  //if (settings.jsValues === undefined) { throw new Error(); }
} catch (e) {
  console.error('Не удалось получить настройки для target=' + cmdOptions.target);
  process.exit(1);
}


/**********************************************************************************************
 * ТАСКИ
 */

/**
 * Зачистка
 */
gulp.task('clean', function() {
  del.sync([settings.dest], {force: true});
});

/**
 * Рефреш браузера
 */
gulp.task('reload', function() {
  return browserSync.reload();
});

function addWatcher(path, taskName) {
  var reloadTaskName = 'reload_' + taskName;
  gulp.task(reloadTaskName, taskName ? [taskName] : null, function() {
    browserSync.reload();
  });

  gulp.watch(path, [reloadTaskName]);
}


/**
 * Сервер
 */
gulp.task('serve', ['build'], function() {
  addWatcher(['app/js/**/*.js'], 'browserify');
  addWatcher(['app/views/**/*.html', 'app/*.html', 'app/data/*.*'], 'copy-static');
  //addWatcher(['app/images/**', 'app/*'], 'copy-static');

  browserSync({
    server: {
      baseDir: settings.dest,
      index: 'index.html'
      // routes: {
      //   '/images': 'app/images',
      //   '/fonts': 'app/fonts'
      // }
    },
    port: 9000,
    open: false
  });
});

/**
 * Собственоо билд
 */
gulp.task('build', ['clean', 'browserify', 'copy-static', 'html'], function() {

});

gulp.task('copy-static', function() {
  var tasks = ['images', 'fonts', 'data'].map(function(entry) {
    return gulp.src('app/' + entry + '/**')
    .pipe(gulp.dest(settings.dest + '/' + entry));
  });

  tasks.push(gulp.src('app/index.html').pipe(gulp.dest(settings.dest)));
  tasks.push(gulp.src('libs/**').pipe(gulp.dest(settings.dest + '/js')));

  es.concat.apply(null, tasks);
});

gulp.task('html', function() {
  var tasks = settings.htmlSrc
  .map(function(entry) {
    return gulp.src(entry.src)
    .pipe(gulp.dest(settings.dest + '/' + entry.dest));
  });

  return es.concat.apply(null, tasks);
});

gulp.task('browserify', function() {
  return gulp.src(['app/js/main.js'])
    .pipe(plumber({errorHandler: onError}))
    .pipe(browserify())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulpif(settings.jsmin, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(settings.dest + '/js'));
});
