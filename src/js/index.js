// We includes modules and libraries here.
import _ from 'lodash'
import $ from 'jquery'
import 'slick-carousel'

$('.slider').slick({
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1
});

import welcome from './modules/welcome';
import preloader from './modules/preloader';

$('.frappe').on("click", function () {
  require.ensure([], function () {
    require('./modules/dynamic');
  });
});



welcome('Hello');

window.onload = preloader;
