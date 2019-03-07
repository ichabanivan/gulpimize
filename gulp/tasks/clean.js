// Gulp
import del from 'del';
// PATH
import { build } from '../PATH';

// Task
export default () => del(build, {
  force: true
});
