'use strict';

var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var es          = require('event-stream');
var del         = require('del');
var minimist    = require('minimist');
var browserSync = require('browser-sync');
var gulpif      = require('gulp-if');

//var browserify  = require('browserify');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');
  
//var properties  = require('./properties.js');

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
 /* var p = properties[cmdOptions.target];
  settings.jsValues = p.tmpl;
  settings.dest = p.dest || settings.dest;*/

  settings.jsmin = cmdOptions.jsmin;
  settings.cssmin = cmdOptions.cssmin;
  settings.htmlmin = cmdOptions.htmlmin;
 // settings.context = {context: p.context};
  //settings.type = cmdOptions.type || p.type;

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

gulp.task('default', function() {
  var targets = '';
  //var delimetr = '';
/*  for (var k in properties) {
    targets +=  delimetr + k;
    delimetr = ', ';
  }*/

  console.log('Как пользоваться: gulp build --type [type] --target [target] --jsmin [true|false]' +
    '\n\t\t\t --cssmin [true|false] --htmlmin [true|false] --notify [true|false]\n');
  console.log('\t- Параметры по умолчанию:', JSON.stringify(knownOptions['default']));
  console.log('\t- Запуск локального сервера: gulp server [параметры]');
  console.log('\t- Билд клиента: gulp build [параметры]\n');
  console.log('\t- Параметры:');
  console.log('\t\t* type - тип билда клиента (ext - внешний, sbbol - сбербанк)');
  console.log('\t\t* target - выбор сервера', targets);
  console.log('\t\t* jsmin - минификация JS кода');
  console.log('\t\t* cssmin - минификация CSS кода');
  console.log('\t\t* htmlmin - минификация HTML кода');
  console.log('\t\t* notify - показывать уведомления');
});


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
gulp.task('serve', ['clean', 'browserify', 'copy-static'], function() {
  addWatcher(['app/js/**/*.js'], 'browserify');
  addWatcher(['app/views/**/*.html', 'app/*.html'], 'copy-static');

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
    open: true
  });
});

/**
 * Собственоо билд
 */
gulp.task('build', ['clean', 'browserify', 'copy-static'], function() {

});

gulp.task('copy-static', function() {
  var tasks = ['images', 'fonts'].map(function(entry) {
    return gulp.src('app/' + entry + '/**')
    .pipe(gulp.dest(settings.dest + '/' + entry));
  });

  tasks.push(gulp.src('app/index.html').pipe(gulp.dest(settings.dest)));
  tasks.push(gulp.src('libs/**').pipe(gulp.dest(settings.dest + '/js')));

  es.concat.apply(null, tasks);
});


gulp.task('browserify', function() {
  return gulp.src(['app/js/main.js'])
    .pipe(browserify())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(gulpif(settings.jsmin, uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(settings.dest + '/js'));
});