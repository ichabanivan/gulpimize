const gulp          = require('gulp'),                     // The streaming build system
      AssetsPlugin  = require('assets-webpack-plugin'),    // Emits a json file with assets paths
      browserSync   = require('browser-sync'),             // Live CSS Reload & Browser Syncing
      cache         = require('gulp-cache'),               // A cache proxy plugin for gulp
      cheerio       = require('gulp-cheerio'),             // Manipulate HTML and XML files with Cheerio in Gulp.
      combine       = require('stream-combiner2').obj,     // This is a sequel to [stream-combiner](https://npmjs.org/package/stream-combiner) for streams3.
      concat        = require('gulp-concat'),              // Concatenates files
      critical      = require('critical').stream,          // Extract & Inline Critical-path CSS from HTML
      cssfont64     = require('gulp-cssfont64'),           // Encode base64 data from font-files and store the result in a css file.
      csso          = require('gulp-csso'),                // Minify CSS with CSSO.
      del           = require('del'),                      // Delete files and folders
      environments  = require('gulp-environments'),        // A library for easily adding environments (development/production) to Gulp
      eslint        = require('gulp-eslint'),              // A gulp plugin for processing files with ESLint
      fs            = require('fs'),                       // File System
      ftp           = require('vinyl-ftp'),                // Vinyl adapter for FTP
      gulpIf        = require('gulp-if'),                  // Conditionally run a task
      gulplog       = require('gulplog'),                  // Logger for gulp and gulp plugins
      gutil         = require('gulp-util' ),               // Utility functions for gulp plugins
      htmlmin       = require('gulp-html-minifier'),       // Minify HTML with html-minifier.
      htmlmininline = require('gulp-minify-inline'),       // Gulp plugin to uglify inline JS and minify inline CSS
      imagemin      = require('gulp-imagemin'),            // Minify PNG, JPEG, GIF and SVG images
      named         = require('vinyl-named'),              // Give vinyl files chunk names.
      newer         = require('gulp-newer'),               // Only pass through newer source files
      notify        = require('gulp-notify'),              // Gulp plugin to send messages based on Vinyl Files or Errors to Mac OS X, Linux or Windows using the node-notifier module. Fallbacks to Growl or simply logging
      plumber       = require('gulp-plumber'),             // Prevent pipe breaking caused by errors from gulp plugins
      pngquant      = require('imagemin-pngquant'),        // Pngquant imagemin plugin
      postcss       = require('gulp-postcss'),             // Pipe CSS through PostCSS processors with a single parse
      pug           = require('gulp-pug'),                 // Gulp plugin for compiling Pug templates
      rename        = require('gulp-rename'),              // Rename files
      replace       = require('gulp-replace'),             // A string replace plugin for gulp
      rev           = require('gulp-rev'),                 // Static asset revisioning by appending content hash to filenames: unicorn.css => unicorn-d41d8cd98f.css
      revReplace    = require('gulp-rev-replace'),         // Rewrite occurences of filenames which have been renamed by gulp-rev
      sass          = require('gulp-sass'),                // Gulp plugin for sass
      scss          = require('postcss-scss'),             // SCSS parser for PostCSS.
      shorthand     = require('gulp-shorthand'),           // Makes your CSS files lighter and more readable
      sourcemaps    = require('gulp-sourcemaps'),          // Source map support for Gulp.js
      spritesmith   = require('gulp.spritesmith'),         // Convert a set of images into a spritesheet and CSS variables via gulp
      stylelint     = require('stylelint'),                // A mighty, modern CSS linter.
      svgSprite     = require('gulp-svg-sprite'),          // Convert SVG files to symbols with gulp
      svgmin        = require('gulp-svgmin'),              // Minify SVG files with gulp.
      through2      = require('through2').obj,             // A tiny wrapper around Node streams2 Transform to avoid explicit subclassing noise
      uglify        = require('gulp-uglify'),              // Minify files with UglifyJS
      uncss         = require('gulp-uncss'),               // Remove unused CSS selectors.
      webpack       = require('webpack'),                  // Webpack
      webpackStream = require('webpack-stream'),           // Run webpack through a stream interface
      zip           = require('gulp-zip');                 // ZIP compress files

let project     = require('./config.js'),
    stylelintrc = require('./.stylelintrc');

let path = {
  folder: '.',
  app:  {
    folder:   './app/',
    allFiles: './app/**/*',
    htaccess: './app/.htaccess',
    pug: {
      folder:   './app/pug/',
      allFiles: './app/pug/**/*.{pug,pug}',
      data: {
        folder: './app/pug/data/',
        file:   './app/pug/data/content.json'
      },
      pages: {
        folder:   './app/pug/pages/',
        allFiles: './app/pug/pages/*.{pug,pug}'
      }
    },
    postcss: {
      folder:   './app/postcss/',
      allFiles: './app/postcss/**/*.{css,pcss}',
      main:   './app/postcss/*.{css,pcss}',
      mixins: './app/postcss/mixins/*.pcss',
      components: './app/postcss/components/*.pcss',
      files: {
        style:  './app/postcss/pages/*.pcss',
        header: './app/*.scss',
        base:   './app/postcss/_base.pcss',
        libs:   './app/postcss/libs.pcss'
      }
    },
    es6: {
      folder:   './app/es6/',
      allFiles: './app/es6/*.js',
      files: {
        es6:  './app/es6/main.js'
      }
    },
    libs: {
      folder: './app/libs/'
    },
    img: {
      folder:   './app/img/',
      allImg: './app/img/**/*.{png, jpg}',
      allFiles: './app/img/**/*',
      svg: './app/img/**/*.svg'
    },
    sprite: {
      allImg: './app/sprite/**/*.{png, jpg}',
      allSvg: './app/sprite/**/*.svg'
    },
    fonts: {
      folder:    './app/fonts/',
      allFiles:  './app/fonts/**/*',
      woffFiles: './app/fonts/**/*.{woff,woff2}',
      woff:      './app/fonts/**/*.woff',
      woff2:     './app/fonts/**/*.woff2'
    },
    manifest : {
      folder:   './app/manifest/',
      allFiles: ['./app/manifest/css.json', './app/manifest/libs-css.json', './app/manifest/webpack.json']
    }
  },
  dist: {
    folder:   './dist/',
    allFiles: './dist/**/*',
    html:{
      allFiles: './dist/*.html'
    },
    css: {
      folder: './dist/css/',
      allFiles: './dist/css/**/*'
    },
    js:{
      folder: './dist/js/',
      allFiles: './dist/js/**/*'
    },
    libs: {
      folder: './dist/libs/',
      allFiles: './dist/libs/**/*'
    },
    img: {
      folder: './dist/img/',
      allFiles: './dist/img/**/*'
    },
    fonts: {
      folder: './dist/fonts/',
      allFiles: './dist/fonts/**/*'
    }
  }
};

let postcssImport   = require('postcss-import'),
    precss          = require('precss'),
    propertyLookup  = require('postcss-property-lookup'),
    pxtorem         = require('postcss-pxtorem')({
      rootValue: 16,               // (Number) The root element font size.
      unitPrecision: 5,            // (Number) The decimal numbers to allow the REM units to grow to.
      propWhiteList: [],           // (Array) The properties that can change from px to rem.
      selectorBlackList: ['html'], // (Array) The selectors to ignore and leave as px.
      replace: true,               // (Boolean) replaces rules containing rems instead of adding fallbacks.
      mediaQuery: true,            // false // (Boolean) Allow px to be converted in media queries.
      minPixelValue: 4             // (Number) Set the minimum pixel value to replace.
    }),
    discardComments = require('postcss-discard-comments')({
      removeAll: true
    }),
    mqpacker        = require('css-mqpacker'),
    cssnext         = require('postcss-cssnext')({
      browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7']
    }),
    assets          = require('postcss-assets')({
      loadPaths: ['./app/img/'],
      relativeTo: './app/scss/'
    }),
    extend          = require('postcss-extend'),
    short           = require('postcss-short'),
    sorting         = require('postcss-sorting'),
    flexbugs        = require('postcss-flexbugs-fixes');

const libs = [
  postcssImport, discardComments, mqpacker, cssnext, sorting, flexbugs
],
processors = [
  postcssImport, precss, propertyLookup, pxtorem, assets, extend, short, mqpacker, sorting, flexbugs
];

let isDevelopment = true,
    development = environments.development,
    production  = environments.production;


////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                  SERVER                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
  * Run local server from a specified folder
  */

gulp.task('server', () => {
  browserSync({
    server: {
      baseDir: path.dist.folder // Run server from this folder
    },
    notify: false // Disable notify in browser
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                   Jade                                         //
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
  * Сompile your Pug templates into HTML
  *
  * on the assumption of config.js
  *
  * @project.css.critical - will create critical.css
  * @project.html.removeComments - will remove comments and empty lines
  * @project.html.minify - will minify html and inline css and inline js
  *
  */

gulp.task('pug', () => {

  // Include JSON with data for pug
  const YOUR_LOCALS = path.app.pug.data.file;

  return gulp.src(path.app.pug.pages.allFiles)
    .pipe(plumber({
        errorHandler: notify.onError((err) => {
          return {
            title: 'pug',
            message: err.message
          }
        })
      }))
    .pipe(pug({
      // It's parse JSON with data for pug(pug)
      locals: JSON.parse(fs.readFileSync(YOUR_LOCALS, 'utf-8')),
      pretty: '  '
    }))
    // If it's production then includes all the file with their new names from manifest file and create critical.css
    .pipe(production(revReplace({
      manifest: gulp.src(path.app.manifest.allFiles, {allowEmpty: true})
    })))
    .pipe(gulpIf(project.css.critical, critical({
      base: 'dist/',
      inline: true,
      css: JSON.parse(fs.readFileSync('./app/manifest/css.json', 'utf8'))['style.css'],
      minify: true,
      extract: true
    })))
    .pipe(gulpIf(project.html.removeComments, combine(
      // Remove html comments
      replace(/<!--.*-->/g, ''),
      // Remove empty lines
      replace(/^\s*\n/mg, '')
    )))
    .pipe(gulpIf(project.html.minify, combine(
      // Minify inline CSS and JS
      htmlmininline(),
      // Minify HTML
      htmlmin({collapseWhitespace: true})
    )))
    .pipe(gulp.dest(path.dist.folder))
    .pipe(browserSync.reload({stream: true}));

});

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                   PostCSS                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
  * A mighty, modern CSS linter that helps you enforce consistent conventions and avoid errors in your stylesheets.
  */

gulp.task('css:stylelint', () => {
  return gulp.src(path.app.postcss.allFiles)
  .pipe(plumber({
    errorHandler: notify.onError((err) => {
      return {
        title: 'css:stylelint',
        message: err.message
      }
    })
  }))
  .pipe(postcss([stylelint(stylelintrc)], {
    syntax: scss
  }));
});

/**
  * Сompile your PostCSS templates into CSS
  */

gulp.task('css:main', () => {
  return gulp.src(path.app.postcss.files.style)
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'css:main',
          message: err.message
        }
      })
    }))
    // If it's development this plugin will start to write sourcemaps
    .pipe(development(sourcemaps.init()))
    .pipe(postcss(processors, {
      syntax: scss
    }))
    // Makes your CSS files lighter and more readable
    .pipe(shorthand())
    // Remove empty lines
    .pipe(replace(/^\s*\n/mg, '\n'))
    .pipe(rename('style.css'))
    // If it's production this plugin will minify css and create manifest
    .pipe(production(combine(csso(), rev())))
    // If it's development this plugin will finish to write sourcemaps
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest(path.dist.css.folder))
    // If it's production this plugin will write manifest in css.json and unload into manifest folder
    .pipe(production(combine(rev.manifest('css.json'), gulp.dest(path.app.manifest.folder))))
    .pipe(browserSync.reload({stream: true}));
});

/**
  * Build all the libraries in one file and minify them
  *
  * @project.css.removeFontFace - will remove unused CSS selectors.
  * @project.css.uncss - will remove unused CSS selectors.
  *
  * The following error of the lack of loadFonts. That's all right
  * NETWORK_ERR: XMLHttpRequest Exception 101: A network error occurred in synchronous requests.
  *
  */

gulp.task('css:libs', () => {
  return gulp.src(path.app.postcss.files.libs)
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'css:libs',
          message: err.message
        }
      })
    }))
    // If it's development this plugin will start to write sourcemaps
    .pipe(development(sourcemaps.init()))
    .pipe(postcss(libs, {
      syntax: scss
    }))
    // It's remove font-face from libraries
    .pipe(gulpIf(project.css.removeFontFace, replace(/\@font-face[^}]+\}/g, '')))
    // It's remove unused CSS selectors from libraries
    .pipe(gulpIf(project.css.uncss, uncss({
      html: [path.dist.html.allFiles]
    })))
    .pipe(rename('libs.css'))
    // If it's production this plugin will minify css and create manifest
    .pipe(production(combine(csso(), rev())))
    // It's remove all the comments from CSS
    .pipe(gulpIf(project.css.removeComments, combine(
      // Remove css comments
      replace(/\/\*[\s\S]*?\*\//g, ''),
      // Remove empty lines
      replace(/^\s*\n/mg, '')
    )))
    // If it's development this plugin will finish to write sourcemaps
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest(path.dist.css.folder))
    // If it's production this plugin will write manifest in css.json and unload it to manifest folder
    .pipe(production(combine(rev.manifest('libs-css.json'), gulp.dest(path.app.manifest.folder))))
    .pipe(browserSync.reload({stream: true}));
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                    JavaScript                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
  * A fully pluggable tool for identifying and reporting on patterns in JavaScript.
  *
  * More information:
  * https://www.youtube.com/watch?v=pjdrg6n5puU
  * https://github.com/iliakan/gulp-screencast/blob/master/10-plugins-lint/gulpfile.js
  */

gulp.task('js:lint', function() {

  let eslintResults = {};

  // Use '/' instead '\\' on Unix system
  let cacheFilePath = process.cwd() + '\\lintCache.json';

  try {
    eslintResults = JSON.parse(fs.readFileSync(cacheFilePath));
  } catch (e) {}

  return gulp.src(path.app.es6.allFiles, {read: false})
    .pipe(gulpIf(
      function(file) {
        return eslintResults[file.path] && eslintResults[file.path].mtime == file.stat.mtime.toJSON();
      },
      through2(function(file, enc, callback) {
        file.eslint = eslintResults[file.path].eslint;
        callback(null, file);
      }),
      combine(
        through2(function(file, enc, callback) {
          file.contents = fs.readFileSync(file.path);
          callback(null, file);
        }),
        eslint(),
        through2(function(file, enc, callback) {
          eslintResults[file.path] = {
            eslint: file.eslint,
            mtime: file.stat.mtime
          };
          callback(null, file);
        })
      )
    ))
    .pipe(eslint.format())
    .on('end', function() {
      fs.writeFile(cacheFilePath, JSON.stringify((eslintResults)));
    })

});

/**
 * Gulp + Webpack = ♡
 *
 * Build all the js file
 *
 */

gulp.task('js:webpack', (callback) => {

  const NODE_ENV = isDevelopment ? 'development' : 'production'; // Set environments
  let firstBuildReady = false;

  function done(err, stats) {
    firstBuildReady = true;

    if (err) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
      return;  // emit('error', err) in webpack-stream
    }

    gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
      colors: true
    }));

  }

  // options related to how webpack emits results
  let options = {

    output: {
      library: '[name]', // the name of the exported library
      publicPath: (project.pablicPath && !isDevelopment) ? project.pablicPath + '/js/' : '/js/', // If it's production and will be upload on sever then full path, another way '/js/'
      filename: isDevelopment ? '[name].js' : '[name]-[hash:10].js', // the filename template for entry chunks
      chunkFilename: isDevelopment ? '[name].js' : '[name]-[hash:10].js' // the filename template for additional chunks
    },

    watch: isDevelopment, // Turn on watch mode. This means that after the initial build, webpack will continue to watch for changes in your js

    watchOptions: {
      aggregateTimeout: 100 // Add a delay before rebuilding once the first file changed.
    },

    devtool: isDevelopment ? 'cheap-inline-module-source-map' : null,

    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            'es2015'
          ]
        }
      }]
    },

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV)
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'commons', // The chunk name of the commons chunk.
        filename: 'commons.js', // The filename template for the commons chunk.
        minChunks: 2 // The minimum number of chunks which need to contain a module before it's moved into the commons chunk.
      })
    ]

  };

  if (!isDevelopment) {

    options.plugins.push(new AssetsPlugin({
      filename: 'webpack.json',
      path: path.app.manifest.folder,
      processOutput(assets) {
        for (let key in assets) {
          if (assets.hasOwnProperty(key)) {
            assets[key + '.js'] = assets[key].js.slice(options.output.publicPath.length);
            delete assets[key];
          }
        }
        return JSON.stringify(assets);
      }
    }));

  }

  console.info(`Your public path - ${options.output.publicPath}`);

  return gulp.src(path.app.es6.allFiles)
  .pipe(plumber({
    errorHandler: notify.onError((err) => {
      return {
        title: 'js:webpack',
        message: err.message
      }
    })
  }))
  .pipe(named())
  .pipe(webpackStream(options, webpack, done))
  .pipe(production(uglify()))
  .pipe(gulp.dest(path.dist.js.folder))
  .on('data', () => {
    if (firstBuildReady && !callback.called) {
      callback.called = true;
      callback();
    }
  });

});

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                     Image                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Minify all the images
 */

gulp.task('img', () => {
  return gulp.src(path.app.img.allFiles, {since: gulp.lastRun('img')})
    .pipe(plumber({
    errorHandler: notify.onError((err) => {
      return {
        title: 'img',
        message: err.message
      }
    })
  }))
    .pipe(newer(path.dist.img.folder))
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest(path.dist.img.folder));
});

/**
 * Create image sprite
 */

gulp.task('img:sprites', () => {
  let spriteData = gulp.src(path.app.sprite.allImg).pipe(spritesmith({
    imgName:   'sprite.png',
    cssName:   'sprite.css',
    cssFormat: 'css',
    imgPath:   '../img/sprite.png',
    padding:   70
  }));
  // CSS file will direct to './app/postcss/'. Sprite.png file will direct to './app/img/'
  return spriteData.pipe(gulpIf('*.css', gulp.dest(path.app.postcss.folder), gulp.dest(path.dist.img.folder)))
    .pipe(browserSync.reload({stream: true}));
});

/**
 * Create svg sprite
 */

gulp.task('svg:sprites', () => {
  return gulp.src(path.app.sprite.allSvg)
  .pipe(plumber({
    errorHandler: notify.onError((err) => {
      return {
        title: 'svg',
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
    run: ($) => {
      $('[fill]').removeAttr('fill');
      $('[stroke]').removeAttr('stroke');
      $('[style]').removeAttr('style');
    },
    parserOptions: {xmlMode: true}
  }))
  // Cheerio plugin create unnecessary string '&gt;', so replace it.
  .pipe(replace('&gt;', '>'))
  // Build svg sprite
  .pipe(svgSprite({
    mode: {
      symbol: {
        sprite: '../sprite.svg',
        render: {
          postcss: {
            dest: '../svg-symbols.scss',
            template: './app/postcss/_sprite_template.scss'
          }
        }
      }
    }
  }))
  .pipe(gulpIf('*.scss', combine(
    sass({outputStyle: 'expanded'}),
    gulp.dest(path.app.postcss.folder)
  ), gulp.dest(path.dist.img.folder)))
  .pipe(browserSync.reload({stream: true})); // Browser will reload
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                   Fonts                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Encode base64 data from font-files (woff) and store the result in a css file.
 */

gulp.task('fonts-woff', () => {
  return new Promise((resolve, reject) => {
    gulp.src(path.app.fonts.woff)
    .pipe(cssfont64())
    .pipe(concat('fonts.woff.css'))
    .pipe(replace(/x-font-woff;/g, 'x-font-woff;charset=utf-8;'))
    .pipe(replace(/\);}/g, ') format(\'woff\'); font-weight:normal; font-style:normal}'))
    .pipe(gulp.dest(path.dist.css.folder))
    .pipe(browserSync.reload({stream: true}));
    resolve()
  });
});

/**
 * Encode base64 data from font-files (woff2) and store the result in a css file.
 */

gulp.task('fonts-woff2', () => {
  return new Promise((resolve, reject) => {
    gulp.src(path.app.fonts.woff2)
    .pipe(cssfont64())
    .pipe(concat('fonts.woff2.css'))
    .pipe(replace(/octet-stream/g, 'x-font-woff2;charset=utf-8'))
    .pipe(replace(/\);}/g, ') format(\'woff\'); font-weight:normal; font-style:normal}'))
    .pipe(gulp.dest(path.dist.css.folder))
    .pipe(browserSync.reload({stream: true}));
    resolve()
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                 .htaccess                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('htaccess', () => {
  return gulp.src(path.app.htaccess)
    .pipe(gulp.dest(path.dist.folder))
    .pipe(browserSync.reload({stream: true}));
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                     OTHER                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Deleted folder 'dist'
 */

gulp.task('del', () => {
  return del(path.dist.folder);
});

/**
 * Directory 'dist' archived and renamed in 'project.zip'
 */

gulp.task('zip', () => {
  return gulp.src(path.dist.allFiles)
    .pipe(zip(`${project.name}.zip`))
    .pipe(gulp.dest(path.folder));
});

/**
 * Clear cache
 */

gulp.task('cache', () => {
  return new Promise((resolve, reject) => {
    cache.clearAll();
    resolve();
  });
});

/**
 * Upload all the files from './dist/' to server
 */

gulp.task('deploy', () => {

  let conn = ftp.create({
    host:     project.server.host,
    user:     project.server.user,
    password: project.server.password,
    parallel: 10,
    log: gutil.log
  });

  let globs = [
    'dist/**',
    'dist/.htaccess'
  ];

  return gulp.src(globs, {buffer: false})
    .pipe(conn.dest(`/public_html/${project.name}/`));

});

/**
 * Set environments as production
 */

gulp.task('set-prod', () => {
  return new Promise((resolve, reject) => {
    environments.current(production);
    resolve();
  });
});

/**
 * Show the current environments
 */

gulp.task('env', () => {
  return new Promise((resolve, reject) => {
    console.log(` development - ${environments.development()} \n production  - ${environments.production()} `);
    isDevelopment = environments.development(); // Set environments as development
    resolve();
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                              Watch                                             //
////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('watch', () => {
  gulp.watch(path.app.pug.allFiles, gulp.series('pug'));
  gulp.watch(path.app.postcss.allFiles, gulp.series('css:main'));
  gulp.watch(path.app.postcss.files.libs, gulp.series('css:libs'));
  gulp.watch(path.app.img.allFiles, gulp.series('img'));
  gulp.watch(path.app.sprite.allFiles, gulp.series('img:sprites', 'svg:sprites'));
  gulp.watch(path.app.fonts.woffFiles, gulp.parallel('fonts-woff', 'fonts-woff2'));
  gulp.watch(path.dist.js.allFiles).on('change', browserSync.reload);
});

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                           Development                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task(
  'default',
  gulp.series(
    'env', 'del',
    gulp.parallel(
      'img:sprites', 'svg:sprites', 'htaccess', 'fonts-woff', 'fonts-woff2', 'css:libs', 'css:main', 'img', 'js:webpack'
    ),
    gulp.series('pug'),
    gulp.parallel('server', 'watch')
  )
);

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                           Production                                           //
////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('production', gulp.series('set-prod', 'default'));
