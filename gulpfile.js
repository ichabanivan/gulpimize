const gulp          = require("gulp"),                     // The streaming build system
      AssetsPlugin  = require("assets-webpack-plugin"),    // Emits a json file with assets paths
      bourbon       = require("node-bourbon"),             // Node-sass wrapper for thoughtbot's bourbon library
      browserSync   = require("browser-sync"),             // Live CSS Reload & Browser Syncing
      cache         = require("gulp-cache"),               // A cache proxy plugin for gulp
      cheerio       = require("gulp-cheerio"),             // Manipulate HTML and XML files with Cheerio in Gulp.
      cleanCSS      = require("gulp-clean-css"),           // Minify css with clean-css.
      combine       = require("stream-combiner2").obj,     // This is a sequel to [stream-combiner](https://npmjs.org/package/stream-combiner) for streams3.
      concat        = require("gulp-concat"),              // Concatenates files
      cssfont64     = require("gulp-cssfont64"),           // Encode base64 data from font-files and store the result in a css file.
      csso          = require("gulp-csso"),                // Minify CSS with CSSO.
      del           = require("del"),                      // Delete files and folders
      environments  = require("gulp-environments"),        // A library for easily adding environments (development/production) to Gulp
      fs            = require("fs"),                       // File System
      ftp           = require("vinyl-ftp"),                // Vinyl adapter for FTP
      gulpIf        = require("gulp-if"),                  // Conditionally run a task
      gulplog       = require("gulplog"),                  // Logger for gulp and gulp plugins
      gutil         = require("gulp-util" ),               // Utility functions for gulp plugins
      imagemin      = require("gulp-imagemin"),            // Minify PNG, JPEG, GIF and SVG images
      named         = require("vinyl-named"),              // Give vinyl files chunk names.
      newer         = require("gulp-newer"),               // Only pass through newer source files
      notify        = require("gulp-notify"),              // Gulp plugin to send messages based on Vinyl Files or Errors to Mac OS X, Linux or Windows using the node-notifier module. Fallbacks to Growl or simply logging
      plumber       = require("gulp-plumber"),             // Prevent pipe breaking caused by errors from gulp plugins
      pngquant      = require("imagemin-pngquant"),        // Pngquant imagemin plugin
      postcss       = require("gulp-postcss"),             // Pipe CSS through PostCSS processors with a single parse
      pug           = require("gulp-pug"),                 // Gulp plugin for compiling Pug templates
      rename        = require("gulp-rename"),              // Rename files
      replace       = require("gulp-replace"),             // A string replace plugin for gulp
      rev           = require("gulp-rev"),                 // Static asset revisioning by appending content hash to filenames: unicorn.css => unicorn-d41d8cd98f.css
      revReplace    = require("gulp-rev-replace"),         // Rewrite occurences of filenames which have been renamed by gulp-rev
      sass          = require("gulp-sass"),                // Gulp plugin for sass
      scss          = require("postcss-scss"),             // SCSS parser for PostCSS.
      shorthand     = require("gulp-shorthand"),           // Makes your CSS files lighter and more readable
      sourcemaps    = require("gulp-sourcemaps"),          // Source map support for Gulp.js
      spritesmith   = require("gulp.spritesmith"),         // Convert a set of images into a spritesheet and CSS variables via gulp
      svgSprite     = require("gulp-svg-sprite"),          // Convert SVG files to symbols with gulp
      svgmin        = require("gulp-svgmin"),              // Minify SVG files with gulp.
      uglify        = require("gulp-uglify"),              // Minify files with UglifyJS
      webpackStream = require("webpack-stream"),           // Run webpack through a stream interface
      webpack       = webpackStream.webpack,               // Webpack
      zip           = require("gulp-zip");                 // ZIP compress files

let project = require("./config.js");

const processors = [
  require("postcss-strip-inline-comments"), // Strip inline comments using the postcss-scss parser "// - " "/* + */"
  require("css-mqpacker"),                  // Pack same CSS media query rules into one using PostCSS
  require("postcss-pxtorem")({
    rootValue: 16,               // (Number) The root element font size.
    unitPrecision: 5,            // (Number) The decimal numbers to allow the REM units to grow to.
    propWhiteList: [],           // (Array) The properties that can change from px to rem.
    selectorBlackList: ["html"], // (Array) The selectors to ignore and leave as px.
    replace: true,               // (Boolean) replaces rules containing rems instead of adding fallbacks.
    mediaQuery: true,            // false // (Boolean) Allow px to be converted in media queries.
    minPixelValue: 4             // (Number) Set the minimum pixel value to replace.
  }),
  require("autoprefixer")({browsers: ["last 15 versions", "> 1%", "ie 8", "ie 7"]}),
  require("postcss-sorting"),        // PostCSS plugin to sort rules content with specified order.
  require("postcss-flexbugs-fixes"), // PostCSS plugin This project tries to fix all of flexbug"s issues
];

let path = {
  folder: ".",
  app:  {
    folder:   "./app/",
    allFiles: "./app/**/*",
    htaccess: "./app/.htaccess",
    jade: {
      folder:   "./app/jade/",
      allFiles: "./app/jade/**/*.{jade,pug}",
      data: {
        folder: "./app/jade/data/",
        file:   "./app/jade/data/content.json"
      },
      pages: {
        folder:   "./app/jade/pages/",
        allFiles: "./app/jade/pages/*.{jade,pug}"
      }
    },
    scss: {
      folder:   "./app/scss/",
      allFiles: "./app/scss/**/*.{css,scss}",
      includePaths: ["./node_modules/susy/sass" , bourbon.includePaths],
      main:   "./app/scss/*.{css,scss}",
      mixins: "./app/scss/mixins/*.scss",
      components: "./app/scss/components/*.scss",
      files: {
        style:  "./app/scss/pages/*.scss",
        header: "./app/*.scss",
        base:   "./app/scss/_base.scss",
        libs:   "./app/scss/libs.scss"
      }
    },
    es6: {
      folder:   "./app/es6/",
      allFiles: "./app/es6/*.js",
      files: {
        es6:  "./app/es6/main.js"
      }
    },
    libs: {
      folder: "./app/libs/"
    },
    img: {
      folder:   "./app/img/",
      allImg: "./app/img/**/*.{png, jpg}",
      allFiles: "./app/img/**/*",
      svg: "./app/img/**/*.svg"
    },
    sprite: {
      allImg: "./app/sprite/**/*.{png, jpg}",
      allSvg: "./app/sprite/**/*.svg"
    },
    fonts: {
      folder:    "./app/fonts/",
      allFiles:  "./app/fonts/**/*",
      woffFiles: "./app/fonts/**/*.{woff,woff2}",
      woff:      "./app/fonts/**/*.woff",
      woff2:     "./app/fonts/**/*.woff2"
    },
    manifest : {
      folder:   "./app/manifest/",
      allFiles: ["./app/manifest/css.json", "./app/manifest/fonts-css.json", "./app/manifest/libs-css.json", "./app/manifest/webpack.json"]
    }
  },
  dist: {
    folder:   "./dist/",
    allFiles: "./dist/**/*",
    css: {
      folder: "./dist/css/",
      allFiles: "./dist/css/**/*"
    },
    js:{
      folder: "./dist/js/",
      allFiles: "./dist/js/**/*"
    },
    libs: {
      folder: "./dist/libs/",
      allFiles: "./dist/libs/**/*"
    },
    img: {
      folder: "./dist/img/",
      allFiles: "./dist/img/**/*"
    },
    fonts: {
      folder: "./dist/fonts/",
      allFiles: "./dist/fonts/**/*"
    }
  }
};

let isDevelopment = true,
    development = environments.development,
    production  = environments.production;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                  SERVER                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task("server", () => {

  browserSync({
    server: {
      baseDir: path.dist.folder // Start server from "./dist/"
    },
    notify: false // Disable notify in browser
  });

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                   Jade                                                             //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task("jade", () => {

  const YOUR_LOCALS = path.app.jade.data.file; // Include JSON with data for jade(pug)

  return gulp.src(path.app.jade.pages.allFiles) // Gulp get all the file from "...jade/pages/*.{jade,pug}"
    // Prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber({
        errorHandler: notify.onError((err) => {
          return {
            title: "jade",
            message: err.message
          }
        })
      }))
    .pipe(pug({
      locals: JSON.parse(fs.readFileSync(YOUR_LOCALS, "utf-8")), // This plugin parse JSON with data for jade(pug)
      pretty: project.minifyHTML ? "" : "  "
    }))
    // If it's production then includes all the file with their new names from manifest file
    .pipe(production(revReplace({
      manifest: gulp.src(path.app.manifest.allFiles, {allowEmpty: true})
    })))
    .pipe(gulp.dest(path.dist.folder)) // Gulp unloads files in "./dist/"
    .pipe(browserSync.reload({stream: true})); // Browser will reload

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                   SCSS                                                             //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task("css:main", () => {

  return gulp.src(path.app.scss.files.style) // Gulp get the file from "./app/scss/pages/*.scss"
    // Prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: "css:main",
          message: err.message
        }
      })
    }))
    .pipe(development(sourcemaps.init())) // If it's development this plugin will start to write sourcemaps
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: path.app.scss.includePaths
    }))
    .pipe(postcss(processors, {
      syntax: scss
    }))
    .pipe(shorthand()) // Makes your CSS files lighter and more readable
    .pipe(replace(/^\s*\n/mg, "\n"))
    .pipe(rename("style.css"))
    .pipe(production(combine(cleanCSS(), rev()))) // If it's production this plugin will minify css and write manifest
    .pipe(development(sourcemaps.write())) // If it's development this plugin will finish to write sourcemaps
    .pipe(gulp.dest(path.dist.css.folder)) // Gulp unloads files in "./dist/css/"
    .pipe(production(combine(rev.manifest("css.json"), gulp.dest(path.app.manifest.folder)))) // If it's production this plugin will write manifest in css.json and unload it to "./app/manifest/"
    .pipe(browserSync.reload({stream: true})); // Browser will reload
});

gulp.task("css:header", () => {

  return gulp.src(path.app.scss.files.header) // Gulp get the file from "./header.scss"
    // Prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: "css:header",
          message: err.message
        }
      })
    }))
    .pipe(development(sourcemaps.init())) // If it's development this plugin will start to write sourcemaps
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: path.app.scss.includePaths
    }))
    .pipe(postcss(processors, {
      syntax: scss
    }))
    .pipe(shorthand()) // Makes your CSS files lighter and more readable
    .pipe(replace(/^\s*\n/mg, "\n"))
    .pipe(rename({suffix: ".min"}))
    .pipe(csso()) // Minify css
    .pipe(development(sourcemaps.write())) // If it's development this plugin will finish to write sourcemaps
    .pipe(gulp.dest(path.app.folder)) // Gulp unloads files in "./app/"
    .pipe(browserSync.reload({stream: true})); // Browser will reload

});

gulp.task("css:libs", () => {

  return gulp.src(path.app.scss.files.libs) // Gulp get the file from "./app/scss/libs.scss"
  // Prevent pipe breaking caused by errors from gulp plugins
  .pipe(plumber({
    errorHandler: notify.onError((err) => {
      return {
        title: "css:libs",
        message: err.message
      }
    })
  }))
  .pipe(development(sourcemaps.init())) // If it's development this plugin will start to write sourcemaps
  .pipe(sass({
    outputStyle: "expanded",
    includePaths: path.app.scss.includePaths
  }))
  .pipe(postcss(processors, {
    syntax: scss
  }))
  .pipe(rename("libs.css"))
  .pipe(production(combine(cleanCSS({compatibility: "ie8"}), rev()))) // If it's production this plugin will minify css and write manifest
  .pipe(development(sourcemaps.write())) // If it's development this plugin will finish to write sourcemaps
  .pipe(gulp.dest(path.dist.css.folder)) // Gulp unloads files in "./dist/css/"
  .pipe(production(combine(rev.manifest("libs-css.json"), gulp.dest(path.app.manifest.folder)))) // If it's production this plugin will write manifest in css.json and unload it to "./app/manifest/"
  .pipe(browserSync.reload({stream: true})); // Browser will reload

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                    JavaScript                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Gulp + Webpack = ♡

gulp.task("webpack", function (callback) {

  const NODE_ENV = isDevelopment ? "development" : "production"; // Set environments
  let firstBuildReady = false;

  function done(err, stats) {
    firstBuildReady = true;

    if (err) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
      return;  // emit("error", err) in webpack-stream
    }

    gulplog[stats.hasErrors() ? "error" : "info"](stats.toString({
      colors: true
    }));

    browserSync.reload();

  }

  let options = {

    output: {
      library: "[name]",
      publicPath: (project.pablicPath && !isDevelopment) ? project.pablicPath + '/js/' : '/js/', // If it's production and will be upload on sever then full path, another way "/js/"
      filename: isDevelopment ? "[name].js" : "[name]-[hash:10].js",
      chunkFilename: isDevelopment ? "[name].js" : "[name]-[hash:10].js"
    },

    watch: isDevelopment,

    watchOptions: {
      aggregateTimeout: 100
    },

    devtool: isDevelopment ? "cheap-inline-module-source-map" : null,

    module: {

      loaders: [{
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["es2015"]
        }
      }],

    },

    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV)
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "common",
        minChunks: 2
      })

    ]

  };

  if (!isDevelopment) {

    options.plugins.push(new AssetsPlugin({
      filename: "webpack.json",
      path: path.app.manifest.folder,
      processOutput(assets) {
        for (let key in assets) {
          if (assets.hasOwnProperty(key)) {
            assets[key + ".js"] = assets[key].js.slice(options.output.publicPath.length);
            delete assets[key];
          }
        }
        return JSON.stringify(assets);
      }
    }));

  }

  console.info(`publicPath is important - ${options.output.publicPath}`);

  return gulp.src(path.app.es6.allFiles) // Gulp get the file from "./app/es6/*.js"
  // Prevent pipe breaking caused by errors from gulp plugins
  .pipe(plumber({
    errorHandler: notify.onError((err) => {
      return {
        title: "webpack",
        message: err.message
      }
    })
  }))
  .pipe(named())
  .pipe(webpackStream(options, null, done))
  .pipe(production(uglify())) // Minify js
  .pipe(gulp.dest(path.dist.js.folder))
  .on("data", () => {
    if (firstBuildReady && !callback.called) {
      callback.called = true;
      callback();
    }
  });

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                     Image                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task("img", () => {

  return gulp.src(path.app.img.allFiles, {since: gulp.lastRun("img")}) // Gulp get the file from "./app/*.{png,jpg}"
    // Prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber({
    errorHandler: notify.onError((err) => {
      return {
        title: "img",
        message: err.message
      }
    })
  }))
    .pipe(newer(path.dist.img.folder)) //  Gulp get the file which have not in "./dist/img/"
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest(path.dist.img.folder)); // Gulp unloads files in "./dist/img/"

});

gulp.task("img:sprites", () => {

  let spriteData = gulp.src(path.app.sprite.allImg).pipe(spritesmith({
    imgName:   "sprite.png",
    cssName:   "sprite.css",
    cssFormat: "css",
    imgPath:   "../img/sprite.png",
    padding:   70
  }));
  // CSS file will direct to "./app/scss/". Sprite.png file will direct to "./app/img/"
  return spriteData.pipe(gulpIf("*.css", gulp.dest(path.app.scss.folder), gulp.dest(path.dist.img.folder)))
    .pipe(browserSync.reload({stream: true})); // Browser will reload

});

gulp.task("svg:sprites", () => {

  return gulp.src(path.app.sprite.allSvg)
  // Prevent pipe breaking caused by errors from gulp plugins
  .pipe(plumber({
    errorHandler: notify.onError((err) => {
      return {
        title: "img",
        message: err.message
      }
    })
  }))
  // Minify svg here
  .pipe(svgmin({
    js2svg: {
      pretty: true
    }
  }))
  // Remove all fill, style and stroke declarations in out shapes
  .pipe(cheerio({
    run: function ($) {
      $("[fill]").removeAttr("fill");
      $("[stroke]").removeAttr("stroke");
      $("[style]").removeAttr("style");
    },
    parserOptions: {xmlMode: true}
  }))
  // Cheerio plugin create unnecessary string "&gt;", so replace it.
  .pipe(replace("&gt;", ">"))
  // Build svg sprite
  .pipe(svgSprite({
    mode: {
      symbol: {
        sprite: "../sprite.svg",
        render: {
          scss: {
            dest: "../svg-symbols.scss",
            template: "./app/scss/_sprite_template.scss"
          }
        }
      }
    }
  }))
  .pipe(gulpIf("*.scss", gulp.dest(path.app.scss.folder), gulp.dest(path.dist.img.folder)))
  .pipe(browserSync.reload({stream: true})); // Browser will reload

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                   Fonts                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task("fonts-woff", () => {

  return new Promise((resolve, reject) => {
    gulp.src(path.app.fonts.woff)
    .pipe(cssfont64())
    .pipe(concat("fonts.woff.css"))
    .pipe(replace(/x-font-woff;/g, "x-font-woff;charset=utf-8;"))
    .pipe(replace(/\);}/g, ') format("woff"); font-weight:normal; font-style:normal}'))
    .pipe(gulp.dest(path.dist.css.folder))
    .pipe(browserSync.reload({stream: true})); // Browser will reload;
    resolve()
  });

});

gulp.task("fonts-woff2", () => {

  return new Promise((resolve, reject) => {
    gulp.src(path.app.fonts.woff2)
    .pipe(cssfont64())
    .pipe(concat("fonts.woff2.css"))
    .pipe(replace(/octet-stream/g, "x-font-woff2;charset=utf-8"))
    .pipe(replace(/\);}/g, ') format("woff"); font-weight:normal; font-style:normal}'))
    .pipe(gulp.dest(path.dist.css.folder))
    .pipe(browserSync.reload({stream: true})); // Browser will reload;
    resolve()
  });

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 .htaccess                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task("htaccess", () => {

  return gulp.src(path.app.htaccess)
    .pipe(gulp.dest(path.dist.folder))
    .pipe(browserSync.reload({stream: true})); // Browser will reload;

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                     OTHER                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task("del", () => {

  return del(path.dist.folder); // Deleted folder "dist"

});

gulp.task("zip", () => {


  return gulp.src(path.dist.allFiles)
    .pipe(zip(`${project.name}.zip`)) // Directory "dist" archived and renamed in "project.zip"
    .pipe(gulp.dest(path.folder))

});

gulp.task("cache", () => {

  return new Promise((resolve, reject) => {
    cache.clearAll();
    resolve()
  })

});

gulp.task("deploy", () => {

  // Upload all the files from "./dist/" to server
  let conn = ftp.create({
    host:     "ivanchaban.hol.es",
    user:     "u257672573",
    password: "IQ5rkKkPrq",
    parallel: 10,
    log: gutil.log
  });

  let globs = [
    "dist/**",
    "dist/.htaccess"
  ];

  return gulp.src(globs, {buffer: false})
    .pipe(conn.dest(`/public_html/${project.name}/`));

});

gulp.task("set-prod", () => {

  return new Promise((resolve, reject) => {
    environments.current(production); // Set environments as production
    resolve()
  })

});

gulp.task("env", () => {

  return new Promise((resolve, reject) => {
    // Show the current environments
    console.log(` development - ${environments.development()} \n production  - ${environments.production()} `);
    isDevelopment = environments.development(); // Set environments as development
    resolve()
  })

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                           Watch & Development                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


gulp.task(
  "default",
  gulp.series(
    "env", "del",
    gulp.parallel(
      "img:sprites", "svg:sprites", "htaccess", "fonts-woff", "fonts-woff2", "css:libs", "css:main", "css:header", "img", "webpack"
    ),
    gulp.series("jade"),
    gulp.parallel("server",
      () => {
        gulp.watch(path.app.jade.allFiles, gulp.series("jade"));
        gulp.watch(path.app.scss.allFiles, gulp.series("css:main"));
        gulp.watch(path.app.scss.mixins, gulp.series("css:main", "css:header", "jade"));
        gulp.watch([path.app.scss.files.header, path.app.scss.files.base], gulp.series("css:header", "jade"));
        gulp.watch(path.app.scss.files.header, gulp.series("css:header", "jade"));
        gulp.watch(path.app.scss.files.libs, gulp.series("css:libs"));
        gulp.watch(path.app.img.allFiles, gulp.series("img"));
        gulp.watch(path.app.sprite.allFiles, gulp.series("img:sprites", "svg:sprites"));
        gulp.watch(path.app.fonts.woffFiles, gulp.parallel("fonts-woff", "fonts-woff2"));
        gulp.watch(path.dist.js.allFiles).on("change", browserSync.reload);
      }
    )
  )
);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                           Watch & Production                                                       //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task("production", gulp.series("set-prod", "default"));
