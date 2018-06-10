// Gulp plugins
var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var useref = require("gulp-useref");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var cssnano = require("gulp-cssnano");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var del = require("del");
var runSequence = require("run-sequence");
var autoprefixer = require("gulp-autoprefixer");

// Build config
const config = {
  paths: {
    src: "src",
    dist: "dist"
  }
};

// SASS processing
gulp.task("sass", function() {
  return gulp
    .src(`${config.paths.src}/stylesheets/scss/main.sass`)
    .pipe(sass())
    .pipe(gulp.dest(`${config.paths.src}/stylesheets/css/`))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// Watch for SASS, HTML, JS file changes
gulp.task("watch", ["browserSync", "sass"], function() {
  gulp.watch(`${config.paths.src}/stylesheets/scss/**/*.sass`, ["sass"]);
  gulp.watch(`${config.paths.src}/*.html`, browserSync.reload);
  gulp.watch(`${config.paths.src}/js/**/*.js`, browserSync.reload);
});

// Live reload via Browser Sync
gulp.task("browserSync", function() {
  browserSync.init({ server: { baseDir: config.paths.src } });
});

// Concatenate JS and CSS files
gulp.task("useref", function() {
  return (
    gulp
      .src(`${config.paths.src}/*.html`)
      .pipe(useref())
      // Minifies JS and CSS files
      .pipe(gulpIf("*.js", uglify()))
      .pipe(gulpIf("*.css", cssnano()))
      .pipe(gulp.dest(config.paths.dist))
  );
});

// Optimize images
gulp.task("images", function() {
  return (
    gulp
      .src(`${config.paths.src}/img/**/*.+(png|jpg|jpeg|gif|svg|ico)`)
      // Cache images that already ran through imagemin
      .pipe(
        cache(
          imagemin({
            interlaced: true
          })
        )
      )
      .pipe(gulp.dest(`${config.paths.dist}/img`))
  );
});

// Add fonts to dist
gulp.task("fonts", function() {
  return gulp
    .src(`${config.paths.src}/fonts/**/*`)
    .pipe(gulp.dest(`${config.paths.dist}/fonts`));
});

// Add vendor prefixes to CSS files
gulp.task("prefix", function() {
  return gulp
    .src(config.paths.src + "/stylesheets/css/**/*.css")
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(gulp.dest(config.paths.src + "/stylesheets/css"));
});

// Clean dist
gulp.task("clean:dist", function() {
  return del.sync(config.paths.dist);
});

// Clean dist + run Gulp tasks
gulp.task("build", function(callback) {
  runSequence(
    "clean:dist",
    "prefix",
    ["sass", "useref", "images", "fonts"],
    callback
  );
});

// Compile + watch SASS, load browser
gulp.task("serve", function(callback) {
  runSequence(["sass", "browserSync", "watch"], callback);
});
