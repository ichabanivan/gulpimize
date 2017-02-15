let project = {
  html: {
    minify: true,         // Do you want compress html?
    removeComments: true, // Do you want remove all the comments?
  },
  css: {
    uncss: true,          // Do you want remove unused CSS selectors from libraries?
    removeFontFace: true, // Do you want remove @font-face from libraries?
    critical: false,      // Only for production
    removeComments: true, // Do you want remove all the comments?
  },
  js: {

  },
  server: {
    host:     'ivanchaban.hol.es',
    user:     'u257672573',
    password: 'IQ5rkKkPrq'
  },
  name: "gulpimize", // You need to input name your project
  pablicPath: "https://zanusilker.github.io/gulpimize", // You need to input path your project without / on end. Example "http://ivanchaban.hol.es/gulpimize"

};

module.exports = project;