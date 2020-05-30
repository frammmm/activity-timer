const srcPath = 'src';
const distPath = 'dist';
const assetsPath = 'assets';

const config = {
  src: {
    root: srcPath,
    pages: srcPath + '/pages',
    styles: srcPath + '/styles',
    js: srcPath + '/js',
    img: srcPath + '/' + assetsPath + '/img',
    icons: srcPath + '/' + assetsPath + '/icons',
    fonts: srcPath + '/' + assetsPath + '/fonts'
  },
  dist: {
    root: distPath,
    html: distPath,
    css: distPath + '/css',
    js: distPath + '/js',
    img: distPath + '/img',
    fonts: distPath + '/fonts'
  },
  assetsPath,
  distPath,
  srcPath,
};

module.exports = config;
