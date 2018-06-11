// Gulp plugins
const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const del = require("del");
const runSequence = require("run-sequence");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const htmlreplace = require("gulp-html-replace");

// Build config
const config = {
  paths: {
    src: "src",
    dist: "dist"
  }
};

// SASS processing
gulp.task("sass", () => {
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
gulp.task("watch", ["browserSync", "sass"], () => {
  gulp.watch(`${config.paths.src}/stylesheets/scss/**/*.sass`, ["sass"]);
  gulp.watch(`${config.paths.src}/*.html`, browserSync.reload);
  gulp.watch(`${config.paths.src}/js/**/*.js`, browserSync.reload);
});

// Live reload via Browser Sync
gulp.task("browserSync", () => {
  browserSync.init({ server: { baseDir: config.paths.src } });
});

// Optimize images for production
gulp.task("compress-images", () => {
  return gulp
    .src(`${config.paths.src}/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`)
    .pipe(
      imagemin({
        interlaced: true
      })
    )
    .pipe(gulp.dest(`${config.paths.dist}/images`));
});

// Move fonts into dist for production
gulp.task("move-fonts", () => {
  return gulp
    .src(`${config.paths.src}/fonts/**/*`)
    .pipe(gulp.dest(`${config.paths.dist}/fonts`));
});

// Add vendor prefixes to CSS files
gulp.task("prefix", () => {
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
gulp.task("clean:dist", () => {
  return del.sync(config.paths.dist);
});

// Transpile all scripts into dist
gulp.task("babel", () => {
  gulp
    .src(`${config.paths.src}/scripts/**/*.js`)
    .pipe(babel({ presets: ["env"] }))
    .pipe(gulp.dest(config.paths.dist));
});

// Move favicon into dist for production
gulp.task("move-favicon", () => {
  return gulp
    .src(`${config.paths.src}/favicon.ico`)
    .pipe(gulp.dest(config.paths.dist));
});

// Build scripts for production
gulp.task("build-scripts", () => {
  return gulp
    .src(`${config.paths.src}/scripts/**/*.js`)
    .pipe(babel({ presets: ["env"] }))
    .pipe(concat("bundle.js"))
    .pipe(uglify())
    .pipe(gulp.dest(`${config.paths.dist}/scripts`));
});

// Build styles for production
gulp.task("build-styles", () => {
  return gulp
    .src(`${config.paths.src}/stylesheets/scss/main.sass`)
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ["last 2 versions"], cascade: false }))
    .pipe(cssnano())
    .pipe(rename("bundle.css"))
    .pipe(gulp.dest(`${config.paths.dist}/styles`));
});

// Moves index.html into dist and replaces all script and style refs with production bundles
gulp.task("build-index", function() {
  gulp
    .src(`${config.paths.src}/index.html`)
    .pipe(
      htmlreplace({
        css: "styles/bundle.css",
        js: {
          src: "scripts/bundle.js",
          tpl: '<script src="%s" defer></script>'
        }
      })
    )
    .pipe(gulp.dest(config.paths.dist));
});

// Compile + watch SASS, load browser
gulp.task("serve", callback => {
  runSequence(["sass", "browserSync", "watch"], callback);
});

// Clean dist + run Gulp tasks
gulp.task("build", callback => {
  runSequence(
    "clean:dist",
    "build-styles",
    "build-scripts",
    ["compress-images", "move-favicon", "move-fonts"],
    "build-index",
    callback
  );
});
