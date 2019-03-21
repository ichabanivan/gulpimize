export const src = './src';
export const build = './build';

const PATH = {
  html: {
    input: [`${src}/*.html`],
    output: [build],
    watch: [`${src}/*.html`, `${src}/html/**/*.html`]
  },
  scss: {
    style: {
      input: [`${src}/scss/pages/*.scss`],
      output: [`${build}/css`],
      watch: [`${src}/scss/**/*.scss`, `!${src}/scss/libs.scss`]
    },
    libs: {
      input: [`${src}/scss/libs.scss`],
      output: [`${build}/css`],
      watch: [`${src}/scss/bootstrap/*.scss`, `${src}/scss/libs.scss`]
    }
  },
  img: {
    input: [`${src}/assets/img/**/*`],
    output: [`${build}/img`],
    watch: [`${src}/assets/img/**/*`],
    folder: [`${src}/assets/img`]
  },
  js: {
    all: [`${src}/js/**/*.js`],
    input: [`${src}/js/pages/*.js`],
    output: [`${build}/js`],
    watch: [`${src}/js/**/*.js`, `!${src}/js/libs.js`]
  }
};

export default PATH;
