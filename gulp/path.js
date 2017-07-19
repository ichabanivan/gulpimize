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
      allFiles: [`${dirname}src/pug/modules/*.{pug,jade}`, `${dirname}src/pug/pages/*.{pug,jade}`, `${dirname}src/pug/*.{pug,jade}`],
      pages: dirname + 'src/pug/pages/*.{pug,jade}',
      data: dirname + 'src/pug/data.json'
    },
    postcss: {
      allFiles: [`${dirname}src/postcss/modules/*.{css,scss,sass,postcss}`, `${dirname}src/postcss/pages/*.{css,scss,sass,postcss}`, `${dirname}src/postcss/*.{css,scss,sass,postcss}`],
      files: {
        libs: dirname + 'src/postcss/libs.*'
      },
      pages: {
        files: dirname + 'src/postcss/pages/*.*'
      }
    },
    js: {
      allFiles: dirname + 'src/js/*.*'
    },
    fonts: {
      allFiles: dirname + 'src/fonts/**/*',
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
