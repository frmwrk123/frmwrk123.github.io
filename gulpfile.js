"use strict";

// Define variables.
const autoprefixer = require("autoprefixer");
const babel = require("gulp-babel");
const browserSync = require("browser-sync").create();
const babelify = require("babelify");
const browserify = require("browserify");
const buffer = require("vinyl-buffer");
const cleancss = require("gulp-clean-css");
const concat = require("gulp-concat");
const del = require("del");
const exec = require("child_process").exec;
const globby = require("globby");
const gulp = require("gulp");
const gutil = require("gulp-util");
const imagemin = require("gulp-imagemin");
const notify = require("gulp-notify");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const run = require("gulp-run");
const sass = require("gulp-ruby-sass");
const sourcemaps = require("gulp-sourcemaps");
const source = require("vinyl-source-stream");
const terser = require("gulp-terser");
const through = require("through2");

// Include paths file.
const paths = require("./_assets/gulp_config/paths");
const dependencies = require("./_assets/gulp_config/dependencies");
const depfiles = dependencies.files.map(f => {
    if (f[0] === "~") return `${f.replace("~", "./node_modules/")}.js`;
    return `${paths.jsFiles}/${f}.js`;
});

// Uses Sass compiler to process styles, adds vendor prefixes, minifies, then
// outputs file to the appropriate location.
gulp.task("build:styles:main", function () {
    return sass(paths.sassFiles + "/main.scss", {
        style: "compressed",
        trace: true,
        loadPath: [paths.includeSass, paths.sassFiles]
    }).pipe(postcss([autoprefixer({browsers: ["last 2 versions"]})]))
        .pipe(cleancss())
        .pipe(gulp.dest(paths.jekyllCssFiles))
        .pipe(gulp.dest(paths.siteCssFiles))
        .pipe(browserSync.stream())
        .on("error", gutil.log);
});

// Processes critical CSS, to be included in head.html.
gulp.task("build:styles:critical", function () {
    return sass(paths.sassFiles + "/critical.scss", {
        style: "compressed",
        trace: true,
        loadPath: [paths.includeSass, paths.sassFiles]
    }).pipe(postcss([autoprefixer({browsers: ["last 2 versions"]})]))
        .pipe(cleancss())
        .pipe(gulp.dest("_includes"))
        .on("error", gutil.log);
});

// Builds all styles.
gulp.task("build:styles", gulp.series("build:styles:main", "build:styles:critical"));

gulp.task("clean:styles", function () {
    return del([paths.jekyllCssFiles + "main.css",
        paths.siteCssFiles + "main.css",
        "_includes/critical.css"
    ]);
});

// Concatenates and uglifies global JS files and outputs result to the
// appropriate location.
gulp.task("build:scripts:global", function () {
    let bundledStream = through();
    const files = depfiles.concat([
        //paths.jsFiles + "/global/lib" + paths.jsPattern,
        paths.jsFiles + "/global/*.js",
        paths.jsFiles + "/main.js"
    ]);
    bundledStream
        .pipe(source("main.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({largeFile: true, loadMaps: true}))
        //.pipe(concat("main.js"))
        //.pipe(terser())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.jekyllJsFiles))
        .pipe(gulp.dest(paths.siteJsFiles))
        .on("error", gutil.log);

    globby(files).then(function(entries) {
        // create the Browserify instance.
        let b = browserify({
            entries: entries,
            debug: true,
        }).transform(babelify, {presets: ["@babel/preset-env"]});

        // pipe the Browserify stream into the stream we created earlier
        // this starts our gulp pipeline.
        b.bundle().pipe(bundledStream);
    }).catch(function(err) {
        // ensure any errors from globby are handled
        bundledStream.emit("error", err);
    });

    return bundledStream;
});

gulp.task("clean:scripts", function () {
    return del([paths.jekyllJsFiles + "main.js", paths.siteJsFiles + "main.js"]);
});

// Concatenates and uglifies leaflet JS files and outputs result to the
// appropriate location.
gulp.task("build:scripts:leaflet", function () {
    return gulp.src([
        paths.jsFiles + "/leaflet/leaflet.js",
        paths.jsFiles + "/leaflet/leaflet-providers.js"
    ]).pipe(concat("leaflet.js"))
        .pipe(terser())
        .pipe(gulp.dest(paths.jekyllJsFiles))
        .pipe(gulp.dest(paths.siteJsFiles))
        .on("error", gutil.log);
});

gulp.task("clean:scripts:leaflet", function () {
    return del([paths.jekyllJsFiles + "leaflet.js", paths.siteJsFiles + "leaflet.js"]);
});

// Builds all scripts.
gulp.task("build:scripts", gulp.series("build:scripts:global"));

// Optimizes and copies image files.
gulp.task("build:images", function () {
    return gulp.src(paths.imageFilesGlob)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.jekyllImageFiles))
        .pipe(gulp.dest(paths.siteImageFiles))
        .pipe(browserSync.stream());
});

gulp.task("clean:images", function () {
    return del([paths.jekyllImageFiles, paths.siteImageFiles]);
});

// Runs jekyll build command.
gulp.task("build:jekyll", function () {
    const shellCommand = "bundle exec jekyll build --config _config.yml";
    return exec(shellCommand);
});

// Runs jekyll build command using test config.
gulp.task("build:jekyll:test", function () {
    const shellCommand = "bundle exec jekyll build --config _config.yml,_config.test.yml";
    return exec(shellCommand);
});

// Runs jekyll build command using local config.
gulp.task("build:jekyll:local", function () {
    const shellCommand = "bundle exec jekyll build --config _config.yml,_config.test.yml,_config.dev.yml";
    return exec(shellCommand);
});

// Deletes the entire _site directory.
gulp.task("clean:jekyll", function () {
    return del(["_site"]);
});

gulp.task("clean", gulp.series("clean:jekyll",
    //"clean:images",
    "clean:scripts",
    "clean:styles"));

// Builds site anew.
gulp.task("build", gulp.series("clean",
    gulp.parallel("build:scripts", "build:styles"),
    "build:jekyll")
);

// Builds site anew using test config.
gulp.task("build:test", gulp.series("clean",
    gulp.parallel("build:scripts", "build:styles"),
    "build:jekyll:test"));

// Builds site anew using local config.
gulp.task("build:local", gulp.series("clean",
    gulp.parallel("build:scripts", "build:styles"),
    "build:jekyll:local"));

// Default Task: builds site.
gulp.task("default", gulp.series("build"));

// Special tasks for building and then reloading BrowserSync.
gulp.task("build:jekyll:watch", gulp.series("build:jekyll:test", function (callback) {
    browserSync.reload();
    callback();
}));

gulp.task("build:scripts:watch", gulp.series("build:scripts", function (callback) {
    browserSync.reload();
    callback();
}));

// Static Server + watching files.
// Note: passing anything besides hard-coded literal paths with globs doesn't
// seem to work with gulp.watch().
gulp.task("serve", gulp.series("build:test", function () {

    browserSync.init({
        server: paths.siteDir,
        ghostMode: false, // Toggle to mirror clicks, reloads etc. (performance)
        logFileChanges: true,
        logLevel: "debug",
        open: true        // Toggle to automatically open page when starting.
    });

    // Watch site settings.
    gulp.watch(["_config.yml"], gulp.series("build:jekyll:watch"));

    // Watch .scss files; changes are piped to browserSync.
    gulp.watch("_assets/css/**/*.scss", gulp.series("build:styles"));

    // Watch .js files.
    gulp.watch("_assets/javascripts/**/*.js", gulp.series("build:scripts:watch"));

    // Watch image files; changes are piped to browserSync.
    gulp.watch("_assets/images/**/*", gulp.series("build:images"));

    // Watch posts.
    gulp.watch("_posts/**/*.+(md|markdown|MD)", gulp.series("build:jekyll:watch"));

    // Watch drafts if --drafts flag was passed.
    if (module.exports.drafts) {
        gulp.watch("_drafts/*.+(md|markdown|MD)", gulp.series("build:jekyll:watch"));
    }

    // Watch html and markdown files.
    gulp.watch(["**/*.+(html|md|markdown|MD)", "!_site/**/*.*"], gulp.series("build:jekyll:watch"));

    // Watch RSS feed XML files.
    gulp.watch("**.xml", gulp.series("build:jekyll:watch"));

    // Watch data files.
    gulp.watch("_data/**.*+(yml|yaml|csv|json)", gulp.series("build:jekyll:watch"));

    // Watch favicon.png.
    gulp.watch("favicon.png", gulp.series("build:jekyll:watch"));
}));

// Updates Ruby gems
gulp.task("update:bundle", function () {
    return gulp.src("")
        .pipe(run("bundle install"))
        .pipe(run("bundle update"))
        .pipe(notify({message: "Bundle Update Complete"}))
        .on("error", gutil.log);
});
