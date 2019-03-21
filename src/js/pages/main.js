import divide from './header';

let main = function () {
  console.log(divide(4, 2));
  console.log(divide(5, 2));
  console.log(divide(15, 2));
  console.log(divide(105, 2));
  console.log(divide(444, 2));
  console.log(divide(444));

  $('body').addClass('red');
};

export default main;