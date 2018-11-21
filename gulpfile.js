'use strict';

const exec = require('child_process').exec;
const path = require('path');
const argv = require('yargs').argv;
const gulp = require('gulp');
const sequence = require('gulp-sequence');
const typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');
const gulpTslint = require('gulp-tslint');
const tslint = require('tslint');
const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');
const rm = require('gulp-rimraf');
const pug = require('gulp-pug');
const cleanCSS = require('gulp-clean-css');

// determine build environment (development | production).
let env = argv.env || 'development';

/**
 * General tasks
 */
gulp.task('git:hooks', () => {
  return gulp.src([
    'hooks/*'
  ]).pipe(gulp.dest('.git/hooks'));
});

/**
 * Server tasks.
 */
gulp.task('server:clean', () => {
  return gulp.src([
    'build/server/**/*.{js,map}',
    'build/main*.{js,map}',
    'build/server',
  ], {read: false}).pipe(rm());
});

gulp.task('server:tslint', () => {
  const program = tslint.Linter.createProgram("./tsconfig.json");
  return gulp.src(['src/**/*.ts', '!src/client/**'])
    .pipe(gulpTslint({
      configuration: 'tslint.json',
      program: program,
      formatter: 'stylish'
    }))
    .pipe(gulpTslint.report({
      summarizeFailureOutput: true
    }));
});

const serverCompiler = typescript.createProject('./tsconfig.json');
gulp.task('server:compile', () => {
  return gulp.src(['src/**/*.ts', '!src/client/**'])
    .pipe(gulpIf(env === 'development', sourcemaps.init()))
    .pipe(serverCompiler())
    .pipe(gulpIf(env === 'development', sourcemaps.write('.', {
      sourceRoot: (file) => {
        return file.cwd + '/src'
      }
    })))
    .pipe(gulp.dest('build/'));
});

gulp.task('server:watch', () => {
  gulp.watch(['src/**/*.ts', '!src/client/**'], ['server:compile']);
});

/**
 * Client tasks
 */
gulp.task('client:clean', () => {
  return gulp.src([
    'build/client',
    'build/universal',
    'pre-build',
  ], {read: false}).pipe(rm());
});

gulp.task('client:tslint', () => {
  const program = tslint.Linter.createProgram("./tsconfig.json");
  return gulp.src(['src/client/**/*.ts'])
    .pipe(gulpTslint({
      configuration: 'tslint.json',
      program: program,
      formatter: 'stylish'
    }))
    .pipe(gulpTslint.report({
      summarizeFailureOutput: true
    }));
});

const clientCompiler = typescript.createProject('./tsconfig.json', {
  esModuleInterop: true
});
gulp.task('client:compile', () => {
  return gulp.src(['src/client/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(clientCompiler())
    .pipe(sourcemaps.write('.', {
      sourceRoot: (file) => {
        return file.cwd + '/src'
      }
    }))
    .pipe(gulp.dest('build/client'));
});

gulp.task('client:pug', () => {
  let buildPath = 'build/client';
  if (env !== 'development')
    buildPath = 'pre-build/client';
  return gulp.src([
    'src/client/**/*.pug',
    '!src/client/index*.pug'
  ])
  .pipe(pug({
    doctype: 'html'
  }))
  .pipe(gulp.dest(buildPath));
});

gulp.task('client:styl', () => {
  let destPath = 'build/client/';
  if (env !== 'development')
    destPath = 'pre-build/client/';
  return gulp.src('src/client/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest(destPath));
});

gulp.task('client:prepare-aot', () => {
  gulp.src([
    'src/client/**/*.ts'
  ]).pipe(gulp.dest('pre-build/client'));
});

gulp.task('client:compile-aot', (callback) => {
  let ngcPath = path.join(__dirname, 'node_modules/.bin/ngc');
  exec(`${ngcPath} -p tsconfig.aot.json`, (err, stdout, stderr) => {
    if (err)
      console.log(stderr);
    callback(err);
  });
});

gulp.task('client:bundle', (callback) => {
  let rollupPath = path.join(__dirname, 'node_modules/.bin/rollup');
  exec(`${rollupPath} -c rollup.config.js`, (err, stdout, stderr) => {
    callback(err);
  });
});

gulp.task('client:bundle-css', (callback) => {
  return gulp.src('pre-build/client/styles/global.css')
    .pipe(cleanCSS({}))
    .pipe(rename('epoll.bundle.min.css'))
    .pipe(gulp.dest('build/client'));
});

gulp.task('client:transpile', () => {
  return gulp.src(['build/client/main.bundle.es2015.js'])
    .pipe(typescript({
      target: 'es5',
      module: 'none',
      allowJs: true,
      outFile: 'main.bundle.min.js',
      moduleResolution: "node"
    }))
    .pipe(uglify())
    .pipe(gulp.dest('build/client/'));
});

gulp.task('client:index', () => {
  let indexPath = 'src/client/index.pug';
  if (env === 'stage')
    indexPath = 'src/client/index.stage.pug';
  if (env === 'production')
    indexPath = 'src/client/index.prod.pug';

  return gulp.src(indexPath)
    .pipe(pug())
    .pipe(rename('index.html'))
    .pipe(gulp.dest('build/client/'));
});

gulp.task('client:compile-universal', (callback) => {
  let ngcPath = path.join(__dirname, 'node_modules/.bin/ngc');
  exec(`${ngcPath} -p tsconfig.universal.json`, (err) => {
    callback(err);
  });
});

gulp.task('client:watch', () => {
  gulp.watch(['src/client/**/*.ts'], ['client:compile']);
  gulp.watch(['src/client/**/*.pug'], ['client:pug']);
  gulp.watch(['src/client/**/*.styl'], ['client:styl']);
});

/**
 * Debug tasks
 */
gulp.task('server:build', sequence(
  'server:clean',
  'server:tslint',
  'server:compile'
));
gulp.task('client:build', sequence(
  'client:clean',
  'client:tslint',
  'client:compile',
  'client:pug',
  'client:styl',
  'client:index'
));
gulp.task('build', sequence(
  'server:build',
  'client:build'
));

/**
 * Release tasks
 */
gulp.task('server:release', sequence(
  'server:clean',
  'server:tslint',
  'server:compile'
));
gulp.task('client:release', sequence(
  'client:clean',
  'client:tslint',
  'client:prepare-aot',
  'client:styl',
  'client:pug',
  'client:compile-aot',
  'client:bundle',
  'client:bundle-css',
  'client:transpile',
  'client:index',
  'client:compile-universal'
));
gulp.task('release', sequence(
  'client:release',
  'server:release'
));

gulp.task('default', ['build']);
