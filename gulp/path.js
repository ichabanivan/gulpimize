const dirname = './';

module.exports = {
  src: {
    folder: `${dirname}src/`,
    favicon: {
      allFiles: `${dirname}/src/favicon/**.*`
    },
    assets: {
      allFiles: `${dirname}src/assets/**/*`
    },
    files: [
      `${dirname}src/.htaccess`,
      `${dirname}src/fonts/**/*`
    ],
    manifest: {
      folder: `${dirname}src/manifest/`,
      allFiles: `${dirname}src/manifest/*.json`
    },
    img: {
      allFiles: `${dirname}src/img/**/*`,
      svg: `${dirname}src/sprite/**/*svg`
    },
    pug: {
      allFiles: [
        `${dirname}src/pug/modules/*.{pug,jade}`,
        `${dirname}src/pug/pages/*.{pug,jade}`,
        `${dirname}src/pug/*.{pug,jade}`
      ],
      pages: `${dirname}src/pug/pages/*.{pug,jade}`,
      data: `${dirname}src/pug/data.json`
    },
    sass: {
      allFiles: [
        `${dirname}src/sass/modules/*.{css,scss}`,
        `${dirname}src/sass/pages/*.{css,scss}`,
        `${dirname}src/sass/*.{css,scss}`
      ],
      files: {
        libs: `${dirname}src/sass/libs.{css,scss}`
      },
      pages: {
        files: `${dirname}src/sass/pages/*.{css,scss}`
      }
    },
    js: {
      allFiles: `${dirname}src/js/*.*`
    },
    fonts: {
      allFiles: `${dirname}src/fonts/**/*`,
      woff: `${dirname}src/fonts/**/*.woff`,
      woff2: `${dirname}src/fonts/**/*.woff2`
    }
  },
  build: {
    folder: `${dirname}build`,
    allFiles: `${dirname}build/**/*`,
    img: {
      folder: `${dirname}build/img/`
    },
    css: {
      folder: `${dirname}build/css`
    },
    js: {
      folder: `${dirname}build/js`,
      allFiles: `${dirname}build/js/*.*`
    },
    html: {
      allFiles: `${dirname}build/*.html`
    },
    fonts: {
      folder: `${dirname}build/fonts/`
    }
  }
};
