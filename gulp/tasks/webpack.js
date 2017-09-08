// Gulp + Webpack = ♡

/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }] */

const
  gulp          = require('gulp'), // The streaming build system
  browserSync   = require('browser-sync'), // Live CSS Reload & Browser Syncing
  environments  = require('gulp-environments'), // A library for easily adding environments (development/production) to Gulp
  plumber       = require('gulp-plumber'), // Prevent pipe breaking caused by errors from gulp plugins
  notify        = require('gulp-notify'), // Gulp plugin to send messages based on Vinyl Files or Errors to Mac OS X, Linux or Windows using the node-notifier module. Fallbacks to Growl or simply logging
  webpack       = require('webpack'), // Webpack
  webpackStream = require('webpack-stream'), // Run webpack through a stream interface
  named         = require('vinyl-named'), // Give vinyl files chunk names.
  uglify        = require('gulp-uglify'), // Minify files with UglifyJS
  gulplog       = require('gulplog'), // Logger for gulp and gulp plugins

  PATH          = require('../path');

let
  isDevelopment = environments.development(),
  production  = environments.production,

  project = require('../../gulpimize-config.js');

gulp.task('webpack', (callback) => {
  const NODE_ENV = isDevelopment ? 'development' : 'production'; // Set environments
  let firstBuildReady = false;

  function done (err, stats) {
    firstBuildReady = true;

    if (err) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
      return; // emit('error', err) in webpack-stream
    }

    gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
      colors: true
    }));
  }

  // options related to how webpack emits results
  let options = {

    output: {
      library: '[name]', // the name of the exported library
      publicPath: (project.publicPath && !isDevelopment) ? project.publicPath + '/js/' : '/js/', // If it's production and will be upload on sever then full path, another way '/js/'
      filename: '[name].js', // the filename template for entry chunks
      chunkFilename: '[name].js' // the filename template for additional chunks
    },

    watch: true, // Turn on watch mode. This means that after the initial build, webpack will continue to watch for changes in your js

    watchOptions: {
      aggregateTimeout: 100 // Add a delay before rebuilding once the first file changed.
    },

    devtool: isDevelopment ? 'cheap-inline-module-source-map' : false,

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

  console.info(`Your public path - ${options.publicPath}`);

  return gulp.src(PATH.src.js.allFiles)
    .pipe(plumber({
      errorHandler: notify.onError((err) => {
        return {
          title: 'webpack',
          message: err.message
        }
      })
    }))
    .pipe(named())
    .pipe(webpackStream(options, webpack, done))
    .pipe(production(uglify()))
    .pipe(gulp.dest(PATH.build.js.folder))
    .pipe(browserSync.reload({stream: true}))
    .on('data', () => {
      if (firstBuildReady && !callback.called) {
        callback.called = true;
        callback();
      }
    });
});
