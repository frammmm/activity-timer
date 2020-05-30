const fs = require('fs');
const config = require('./config');

if (!fs.existsSync(config.srcPath + '/' + config.assetsPath)) {
  fs.mkdirSync(config.srcPath + '/' + config.assetsPath);
}
if (!fs.existsSync(config.src.fonts)) {
  fs.mkdirSync(config.src.fonts);
}
if (!fs.existsSync(config.src.icons)) {
  fs.mkdirSync(config.src.icons);
}
if (!fs.existsSync(config.src.img)) {
  fs.mkdirSync(config.src.img);
}
