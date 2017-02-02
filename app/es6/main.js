// We includes modules and libraries here.

// import $ from 'jquery/dist/jquery.min.js';

import welcome from './modules/welcome';

document.querySelector('.fa.fa-eercast').onclick = function() {
  require.ensure([], function() {
    require('./modules/dynamic');
  });
};

welcome("Hello");





