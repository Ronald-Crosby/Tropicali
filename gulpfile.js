var gulp = require('gulp');
var sass = require("gulp-sass");
var cleanCSS = require("gulp-clean-css")
var sourcemaps = require("gulp-sourcemaps")

var browserSync = require("browser-sync").create()

var imagemin = require("gulp-imagemin")

sass.compiler = require("node-sass")

var ghpages = require("gh-pages")

// sass
gulp.task("sass", function() {
  // we want to run something to watch our app.scss and copy those changes to app.css as we did in the command line earlier

  return gulp.src("src/css/app.scss")
  // sourcemaps negate a problem caused by cleanCSS. When it runs, the line numbers in the css sheet are restored. Otherwise, when the css is viewd by the inspector everything appears to be on line:1.
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
    // cleanCSS turns the code into one line. hard to read for humans but easy to read for computers and saves load times.
      cleanCSS({
        compatibility: "ie8"
      })
    ) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream())
})

// the functions below take the various assets and move them from src to dist. This is standard practice.

// html
gulp.task("html", function() {
  return gulp.src("src/*.html")
    .pipe(gulp.dest("dist"))
})

// fonts
gulp.task("fonts", function() {
  return gulp.src("src/fonts/*")
    .pipe(gulp.dest("dist/fonts"))
})

// images
gulp.task("images", function() {
  return gulp.src("src/img/*")
  // imagemin takes large image files and makes them smaller.
    .pipe(imagemin())
    .pipe(gulp.dest("dist/img"))
})

// watch
gulp.task("watch", function() {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  })
    gulp.watch("src/*.html", ["html"]).on("change", browserSync.reload)
    gulp.watch("src/ css/app.scss", ["sass"])
    gulp.watch("src/fonts/*", ["fonts"])
    gulp.watch("src/img/*", ["images"])
})

// gh pages auto deploys to github when we save

gulp.task("deploy", function() {
  ghpages.publish("dist")
})

// run on load/default
gulp.task('default', ["html", "sass", "fonts", "images", "watch"])