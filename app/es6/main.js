// We includes modules and libraries here.

import $ from 'jquery/dist/jquery';

import welcome from './modules/welcome';

document.querySelector('html').onclick = function() {
  require.ensure([], function() {
    require('./modules/dynamic');
  });
};

welcome("Hello");





