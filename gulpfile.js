var gulp = require('gulp');
var gutil = require('gutil');
var webpack = require('webpack');
var eslint = require('gulp-eslint');
var plumber = require('gulp-plumber');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var scss = require('postcss-scss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var reporter = require('reporter');
var sourcemaps = require('gulp-sourcemaps');

var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var bump = require('gulp-bump');

var getManifest = function () {
    var fs = require('fs');

    return JSON.parse(fs.readFileSync('./build/manifest.json', 'utf8'));
};

/**
 * Clean
 * Cleans the build directory before a build.
 * Used for the build task.
 */
gulp.task('clean', function () {
    return gulp.src(['./build']).pipe(clean());
});

/**
 * ESLint
 * Checks the sourcecode for errors with ESLint. Used for the build and dev tasks.
 */
gulp.task('lint', function () {
    return gulp.src(['app/js/*.js'])
        .pipe(eslint({useEslintrc: true}))
        .pipe(eslint.format());
});

gulp.task('pre-build', function (callback) {
    runSequence(
        'clean',
        'bump',
        'lint',
        'static',
        callback
    );
});

gulp.task('bump', function () {
    return gulp.src(['./manifest.json', './package.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('build', ['pre-build'], function (callback) {
    var config = require('./config/webpack.config.js');
    var compiler = webpack(config);

    compiler.run(function (err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack-build', err);
        }

        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));

        var manifest = getManifest();
        var name = manifest.name + '.' + manifest.version;
    });
});

gulp.task('static', function () {
    gulp.src(['manifest.json', 'src/**/*.png', 'src/**/*.html'])
        .pipe(gulp.dest('./build'));
});

gulp.task('styles', function () {
    var processors = [
        autoprefixer({browsers: ['last 1 version']}),
        cssnano()
    ];

    gulp.src("./src/scss/*.scss")
        // Capture all errors
        .pipe(plumber())

        // Lint the scss
        .pipe(postcss(processors,{ syntax: scss }))

        // Compile the scss
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass({
            includePaths: ['node_modules'],
        }).on('error', sass.logError))

        // Write the files to the public directory
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('build-dev', [], function (callback) {
    var config = require('./config/webpack.config.js');
    var compiler = webpack(config);

    compiler.run(function (err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack-build', err);
        }

        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));

        callback();
    });

});

gulp.task('watch-static', [], function (callback) {
    runSequence(
        'static',
        callback
    );
});

gulp.task('watch-webpack', [], function (callback) {
    runSequence(
        'build-dev',
        callback
    );
});

gulp.task('dev-watch', ['static', 'styles', 'build-dev'], function () {
    gulp.watch(['src/*.json'], ['watch-static']);
    gulp.watch(['src/assets/*.png'], ['watch-static']);

    gulp.watch(['src/js/*.js', 'src/views/*.html'], ['watch-webpack']);
});

gulp.task('dev-build', ['static', 'styles', 'build-dev']);

gulp.task('default', ['dev-build'])
