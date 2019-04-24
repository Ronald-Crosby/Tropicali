///////////////define variables///////////////////

// gulp
var gulp = require('gulp');


// CSS STUFF
// cleanCSS
var cleanCSS = require("gulp-clean-css")
// postCSS
var postcss = require("gulp-postcss")
// sourcemaps
var sourcemaps = require("gulp-sourcemaps")
// concat
var concat = require("gulp-concat")

// browsersync
var browserSync = require("browser-sync").create()

// image minifier
var imagemin = require("gulp-imagemin")

// github pages
var ghpages = require("gh-pages")


///////////////main code starts below///////////////////

// css
gulp.task("css", function() {
  // we want to run something to watch our app.scss and copy those changes to app.css as we did in the command line earlier

  return gulp.src([
    "src/css/reset.css",
    "src/css/typography.css",
    "src/css/app.css"
  ])
  // sourcemaps negate a problem caused by cleanCSS. When it runs, the line numbers in the css sheet are restored. Otherwise, when the css is viewd by the inspector everything appears to be on line:1.
    .pipe(sourcemaps.init())
    .pipe(
      postcss([
        require("autoprefixer"),
        require("postcss-preset-env")({
          stage: 1,
          browsers: ["IE 11", "last 2 versions"]
        })
      ])
    )
    .pipe(concat("app.css"))
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
    gulp.watch("src/css/*", ["css"])
    gulp.watch("src/fonts/*", ["fonts"])
    gulp.watch("src/img/*", ["images"])
})

// gh pages auto deploys to github when we save

gulp.task("deploy", function() {
  ghpages.publish("dist")
})

// run on load/default
gulp.task('default', ["html", "css", "fonts", "images", "watch"])