var gulp = require('gulp');
var gutil = require('gutil');
var webpack = require('webpack');
var eslint = require('gulp-eslint');

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
    gulp.src(['manifest.json', 'src/**/*.png'])
        .pipe(gulp.dest('./build'));
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

gulp.task('dev', ['static', 'build-dev'], function () {
    gulp.watch(['src/*.json'], ['watch-static']);
    gulp.watch(['src/assets/*.png'], ['watch-static']);

    gulp.watch(['src/js/*.js', 'src/views/*.html', 'src/scss/*.scss'], ['watch-webpack']);
});

gulp.task('default', ['dev'])
