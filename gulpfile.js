var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');


var path = {
    HTML: 'src/index.html',
    MINIFIED_OUT: 'bundle.min.js',
    OUT: 'bundle.js',
    DEST: 'assets',
    DEST_JS: 'assets/js',
    ENTRY_POINT: './src/js/app/app.js'
};

// copy html file to final directory assets
gulp.task('copy', function(){
    console.log('copy');
    gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});


gulp.task('watch', function() {
    // copy html file when it changes
    gulp.watch(path.HTML, ['copy']);

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

gulp.task('production', ['replaceHTML', 'build']);
