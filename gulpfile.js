const gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    minify = require('gulp-minify'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();

function pipeHtml() {
    return gulp
        .src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./build'));
}

function pipeSass() {
    return gulp
        .src('./src/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .on('error', sass.logError)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

function pipeJs() {
    return gulp
        .src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(
            minify({
                ext: {
                    min: '.js',
                },
                noSource: true,
            })
        )
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/js'));
}

function pipePublic() {
    return gulp.src('./public/**').pipe(gulp.dest('./build'));
}

function build() {
    pipePublic();
    pipeHtml();
    pipeSass();
    pipeJs();
}

async function watch() {
    await build();

    browserSync.init({
        server: {
            baseDir: './build',
        },
    });

    gulp.watch('./src/**/*.html', async () => {
        await pipeHtml();
        browserSync.reload();
    });

    gulp.watch('./src/scss/**/*.scss', pipeSass);

    gulp.watch('./src/js/**/*.js', async () => {
        await pipeJs();
        browserSync.reload();
    });

    gulp.watch('./public/**', async () => {
        await pipePublic();
        browserSync.reload();
    });
}

exports.watch = watch;
exports.build = build;
