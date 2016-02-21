var gulp = require('gulp');
var gpConcat = require('gulp-concat');
var gpRename = require('gulp-rename');
var gpUglify = require('gulp-uglify');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');

gulp.task('development', function() {
    gulp.src('./public/index.html')
        .pipe(inject(gulp.src('./public/js/**/*.js') // gulp-angular-filesort depends on file contents, so don't use {read: false} here
        .pipe(angularFilesort()),
            {
                ignorePath: 'public',
                addRootSlash: false
            }
    ))
        .pipe(gulp.dest('./public'));
});

gulp.task('uglify', function() {
    return gulp.src(['public/js/main.js',
            'public/js/core/core.module.js',
            'public/js/core/router/router.module.js',
            'public/js/core/router/router.js',
            'public/js/core/run/run.module.js',
            'public/js/core/run/run.js',
            'public/js/controllers/**/*.js',
            'public/js/directives/**/*.js',
            'public/js/services/**/*.js'])


        .pipe(gpConcat('script.js'))
        // .pipe(gulp.dest('public/dist'))
        // .pipe(gpRename('script.js'))
        .pipe(gpUglify({mangle: false}))
        .pipe(gulp.dest('public'));
});
gulp.task('indexUgly', function() {

    gulp.src('./public/index.html')
        .pipe(inject(gulp.src('./public/script.js') // gulp-angular-filesort depends on file contents, so don't use {read: false} here
        .pipe(angularFilesort()),
            {
                ignorePath: 'public',
                addRootSlash: false
            }
        ))
            .pipe(gulp.dest('./public'));
});
gulp.task('production', ['uglify', 'indexUgly'], function() {});
gulp.task('default', [''], function() {});
