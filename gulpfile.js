/**
 * Created by ganbaatar on 9/11/16.
 */
var gulp        = require('gulp');
var clean       = require('gulp-clean');
var concat      = require('gulp-concat');
var ngdocs      = require('gulp-ngdocs');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');
var runSequence = require('run-sequence');

var _app      = 'app/';
var _general = 'app/resources/js/general/';
var _contest = 'app/components/contest/';
var _contest_history = 'app/components/contest_history/';
var _contest_list = 'app/components/contest_list/';
var _contest_upcoming = 'app/components/contest_upcoming/';
// var _contest_live = 'app/components/contest_live/';
// var _contest_upcoming = 'app/components/contest_upcoming/';
var _auth         = 'app/components/auth/';
var _lineup         = 'app/components/lineup/';
var _lineup_upcoming = 'app/components/lineup_upcoming/';
var _lineup_export   = 'app/components/lineup_export/';
var _lineup_live   = 'app/components/lineup_live/';
var _common = 'app/components/common/';
var depsJS      = [
    _app + 'bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
    _app + 'assets/js/vendor/jquery.js',
    _app + 'bower_components/jquery-ui/jquery-ui.min.js',
    _app + 'bower_components/angular/angular.min.js',
    _app + 'bower_components/angular-route/angular-route.min.js',
    _app + 'bower_components/angular-ui-router/release/angular-ui-router.min.js',
    _app + 'bower_components/angular-ui-router/release/angular-ui-router.min.js.map',
    _app + 'assets/js/vendor/foundation.min.js',
    _app + 'bower_components/sly/dist/sly.min.js',
    _app + 'assets/js/vendor/fan-ng-sly.js',
    _app + 'bower_components/slimScroll/jquery.slimscroll.min.js',
    _app + 'bower_components/angular-slimscroll/angular-slimscroll.js',
    _app + 'bower_components/angular-popeye/release/popeye.min.js',
    _app + 'bower_components/satellizer/dist/satellizer.min.js',
    _app + 'bower_components/angular-permission/dist/angular-permission.min.js',
    _app + 'bower_components/angular-permission/dist/angular-permission-ui.min.js'
];
var appJS       = [
    _general + 'app.js',
    _general + 'modules.js',
    _general + 'constants.js',
    _general + 'filters.js',
    _general + 'configs.js',
    _general + 'factories.js',
    _general + 'directives.js',
    _common + '*.js',
    _common + 'player_profile/' + '*.js',
    _common + 'games_popup/' + '*.js',
    _contest + '*.js',
    _contest_history + '*.js',
    _contest_upcoming + '*.js',
    _contest_list + '*.js',
    _lineup + '*.js',
    _lineup_upcoming + '*.js',
    _lineup_export + '*.js',
    _lineup_live + '*.js',
    _auth + '*.js'

];

var depsCss = [
    _app + "bower_components/html5-boilerplate/dist/css/normalize.css",
    _app + "bower_components/html5-boilerplate/dist/css/main.css",
    _app + "assets/css/vendor/foundation.min.css",
    _app + "bower_components/angular-popeye/release/popeye.min.css",
    _app + "assets/css/font-awesome.min.css"

];

var appCss = [
    _app + "assets/css/sly.css",
    _app + "assets/css/style.css",
];

/** tasks */
gulp.task('devDeps', function(){
    var depsjs =  gulp.src(depsJS);
    return depsjs.pipe(concat('assets/fan_dependency.js'))
        .pipe(gulp.dest('app'));
});

gulp.task('devJS', function(){
    var js =  gulp.src(appJS);
    return js.pipe(concat('assets/fan_develop.js'))
        .pipe(gulp.dest('app'));
});

/** tasks */
gulp.task('css1', function(){
    var depsjs =  gulp.src(depsCss);
    return depsjs.pipe(concat('fan_dependency.css'))
        .pipe(gulp.dest('app/assets/css'));
});

gulp.task('css2', function(){
    var js =  gulp.src(appCss);
    return js.pipe(concat('fan_develop.css'))
        .pipe(gulp.dest('app/assets/css'));
});

/** initialize */
gulp.task('default', function(callback){
    runSequence('devDeps', 'devJS', 'css1', 'css2', callback);
});

gulp.task('watch', function ()
{
    gulp.watch('./app/**/*.js', ['devJS']);
    gulp.watch('./app/**/*.css', ['css2']);
});