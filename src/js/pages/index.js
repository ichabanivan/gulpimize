import $ from 'jquery';

$(() => {
  if (process.env.NODE_ENV === 'development') {
    console.log('%c META ', 'color: #fff; background: #ff0000; font-size: 22px;font-weight: bold;',
      '\n process.env.NODE_ENV:', process.env.NODE_ENV,
    );
  }
});
