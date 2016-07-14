'use strict';

// Load plugins
var gulp         = require('gulp');
var less         = require('gulp-sass'); // TODO replace with SASS
var autoprefixer = require('gulp-autoprefixer');
var rename       = require('gulp-rename');
var concat       = require('gulp-concat');
var plumber      = require('gulp-plumber');
var gutil        = require('gulp-util');
var pug         = require('gulp-pug');
var browsersync  = require('browser-sync');
var notify       = require('gulp-notify');




// Browser definitions for autoprefixer
var AUTOPREFIXER_BROWSERS = [
    'last 3 versions',
    'ie >= 8',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];




//build datestamp for cache busting
var getStamp = function() {
    var myDate = new Date();

    var myYear = myDate.getFullYear().toString();
    var myMonth = ('0' + (myDate.getMonth() + 1)).slice(-2);
    var myDay = ('0' + myDate.getDate()).slice(-2);
    var mySeconds = myDate.getSeconds().toString();

    var myFullDate = myYear + myMonth + myDay + mySeconds;

    return myFullDate;
};




// error function for plumber
var onError = function (err) {
    gutil.beep();
    console.log(err);
};




// browser-sync task for starting the server
gulp.task('browser-sync', function() {
    browsersync({
        server: {
            baseDir: "./dist/",
            proxy: "localhost:3000/index.html",
            port:3000
        }
    });
});




// Copy bootstrap files
gulp.task('copy', function(){
    return gulp.src('./src/bootstrap/**')
        .pipe(gulp.dest('./dist/bootstrap'));
});


// copy js files
gulp.task('js', function(){
    return gulp.src('./src/theme/js/**')
        .pipe(gulp.dest('./dist/theme/js'));
});



// Compile less files to /dist
gulp.task('css', function() {
    return gulp.src('./src/theme/less/theme.sass')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(less({ style: 'expanded', }))
        .pipe(gulp.dest('./dist/theme/css/'))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/theme/css/'))
        .pipe(browsersync.reload({ stream:true }))
        .pipe(notify({ message: 'CSS compiled' }));
});




// Jade task compile html to jade templates to /dist
gulp.task('html', function() {
    return gulp.src('./src/pug/pages/*.pug')
        .pipe(pug({
            locals: {
                pretty: true
            }
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(notify({ message: 'HTML compiled' }));
});





//default tasks
gulp.task('default', ['copy', 'css','js', 'html', 'browser-sync'], function(){

    // will run task and reload browser on file change
    gulp.watch('./src/pug/**/*.pug', ['html', browsersync.reload]);
    gulp.watch('./src/theme/less/**/*.less', ['css', browsersync.reload]);
    gulp.watch('./src/theme/js/**/*.js', ['js', browsersync.reload]);

});
