const dirname = './';

module.exports = {
  src: {
    folder: dirname + 'src/',
    files: [`${dirname}src/.htaccess`, `${dirname}src/fonts/**/*`],
    manifest: {
      folder: dirname + 'src/manifest/',
      allFiles: dirname + 'src/manifest/*.json'
    },
    img: {
      allFiles: dirname + 'src/img/**/*',
      svg: dirname + 'src/sprite/**/*svg'
    },
    pug: {
      allFiles: dirname + 'src/pug/**/*.{pug,jade}',
      pages: dirname + 'src/pug/pages/*.{pug,jade}',
      data: dirname + 'src/pug/data.json'
    },
    postcss: {
      allFiles: dirname + 'src/postcss/**/*.{css,pcss,scss}',
      files: {
        libs: dirname + 'src/postcss/libs.{css,pcss,scss}'
      },
      pages: {
        files: dirname + 'src/postcss/pages/*.{css,pcss,scss}'
      }
    },
    js: {
      allFiles: dirname + 'src/js/*.*'
    },
    fonts: {
      woff: dirname + 'src/fonts/**/*.woff',
      woff2: dirname + 'src/fonts/**/*.woff2'
    }
  },
  build: {
    folder: dirname + 'build',
    allFiles: dirname + 'build/**/*',
    img: {
      folder: dirname + 'build/img/'
    },
    css: {
      folder: dirname + 'build/css'
    },
    js: {
      folder: dirname + 'build/js'
    },
    html: {
      allFiles: dirname + 'build/*.html'
    },
    fonts: {
      folder: dirname + 'build/fonts/'
    }
  }
};
