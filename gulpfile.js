var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var rename = require('gulp-rename');
var streamify = require('gulp-streamify');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');


var path = {
    HTML: 'src/index.html',
    LESS: 'src/less/**/*.{less, css}',
    LESS_CONTROLLER: 'src/less/controller.less',
    MINIFIED_OUT: 'bundle.min.js',
    OUT: 'bundle.js',
    OUT_CSS: 'phiroom.min.css',
    DEST: 'assets',
    DEST_JS: 'assets/js',
    DEST_CSS: 'assets/css/',
    ENTRY_POINT: './src/js/app/app.js'
};

// copy html file to final directory assets
gulp.task('copy', function(){
    console.log('copy');
    gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});


gulp.task('less', function () {
    gulp.src(path.LESS_CONTROLLER)
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename(path.OUT_CSS))
    .pipe(gulp.dest(path.DEST_CSS));
});


gulp.task('watch', function() {
    // copy html file when it changes
    gulp.watch(path.HTML, ['copy']);
    gulp.watch(path.LESS, ['less']);

    var watcher  = watchify(browserify({
        entries: [path.ENTRY_POINT],
        transform: [reactify],
        debug: true,
        cache: {}, packageCache: {}, fullPaths: true
    }));

    return watcher.on('update', function () {
        watcher.bundle()
            .pipe(source(path.OUT))
            .pipe(gulp.dest(path.DEST_JS))
            console.log('Updated');
    })
        .bundle()
        .pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST_JS));
});

gulp.task('default', ['watch']);


gulp.task('build', function(){
    browserify({
        entries: [path.ENTRY_POINT],
        transform: [reactify]
    })
        .bundle()
        .pipe(source(path.MINIFIED_OUT))
        .pipe(streamify(uglify({file: path.MINIFIED_OUT})))
        .pipe(gulp.dest(path.DEST_JS));
});


gulp.task('replaceHTML', function(){
    gulp.src(path.HTML)
        .pipe(htmlreplace({
            'js': path.MINIFIED_OUT
        }))
        .pipe(gulp.dest(path.DEST));
});

gulp.task('production', ['replaceHTML', 'build', 'less']);
