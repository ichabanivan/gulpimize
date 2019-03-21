// Gulp
import environments from 'gulp-environments';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import gulp from 'gulp';
import named from 'vinyl-named'; // Give vinyl files chunk names.
import gulplog from 'gulplog';
// PATH
import PATH from '../PATH';
// Server
import { browserSync } from './server';

const publicPath = 'https://zanusilker.github.io/gulpimize/build';
// Environments
const
  isDevelopment = environments.development();

export default (callback) => {
  const NODE_ENV = isDevelopment ? 'development' : 'production'; // Set environments
  let firstBuildReady = false;

  function done(err, stats) {
    firstBuildReady = true;

    if (err) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
      return; // emit('error', err) in webpack-stream
    }

    gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
      colors: true
    }));
  }

  // options related to how webpack emits results
  const options = {

    output: {
      library: '[name]', // the name of the exported library
      // You need to set the path for your project without '/' on the end.
      publicPath: (publicPath && !isDevelopment) ? `${publicPath}/js/` : '/js/',
      filename: '[name].js', // the filename template for entry chunks
      chunkFilename: '[name].js' // the filename template for additional chunks
    },

    watch: true, // Turn on watch mode. This means that after the initial build, webpack will continue to watch for changes in your js

    watchOptions: {
      aggregateTimeout: 100 // Add a delay before rebuilding once the first file changed.
    },

    mode: isDevelopment ? 'development' : 'production',

    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },

    optimization: {
      noEmitOnErrors: true,
      splitChunks: {
        chunks: 'all',
        name: 'commons', // The chunk name of the commons chunk.
        filename: 'commons.js', // The filename template for the commons chunk.
        minChunks: 2 // The minimum number of chunks which need to contain a module before it's moved into the commons chunk.
      }
    },

    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV)
      })
    ]

  };

  gulplog[options.publicPath ? 'info' : 'error'](`Your public path - ${options.publicPath}`);

  return gulp.src(PATH.js.input)
    .pipe(plumber({
      errorHandler: notify.onError(err => ({
        title: 'webpack',
        message: err.message
      }))
    }))
    .pipe(named())
    .pipe(webpackStream(options, webpack, done))
    .pipe(gulp.dest(PATH.js.output))
    .pipe(browserSync.reload({ stream: true }))
    .on('data', () => {
      if (firstBuildReady && !callback.called) {
        callback.called = true;
        callback();
      }
    });
};
