// Gulp
import { create } from 'browser-sync';
// PATH
import { build } from '../PATH';
// Server
export const browserSync = create();

export default () => {
  browserSync.init({
    server: {
      baseDir: build
    },
    notify: false
  });
};
