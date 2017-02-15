// We includes modules and libraries here.
// import $ from 'jquery/dist/jquery';
import welcome from './modules/welcome';

document.querySelector('.fa.fa-eercast').onclick = function name() {
  require.ensure([], () => {
    require('./modules/dynamic');
  });
};

welcome('Hello');
