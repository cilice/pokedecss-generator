const Canvas = require('canvas');
const fs = require('fs');
const unique = require('lodash.uniqby');
const Color = require('color');
const idGenerator = require('incremental-id-generator');
const nextID = idGenerator('abcdefghijklmnopqrstuvwxyz');

let colors = [];
const files = {

};

function readData(path) {
  const filename = path.split(/[\\/]/).pop().split('.').shift();
  const Image = Canvas.Image;
  const pic = fs.readFileSync(path);
  const img = new Image();
  img.src = pic;
  files[filename] = img;
  const width = img.width;
  const height = img.height;
  const canvas = new Canvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);


  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const data = ctx.getImageData(x, y, 1, 1).data;
      const color = Color(`rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`);
      colors.push(color)
    }
  }
  colors = unique(colors, (color) => color.string());
}

readData('./pikachu.png');
readData('./glumanda.png');

const colorMap = colors.reduce((map, color) => {
  map.set(color.rgb().string(), nextID());
  return map;
}, new Map())

function printColorMap(map) {
  console.log(`$colors: (`);
  for (let [color, code] of map) {
    console.log(`  '${code}': '${color}',`);
  }
  console.log(`);`)
}

printColorMap(colorMap);

function printImage(img) {
  const Image = Canvas.Image;
  const width = img.width;
  const height = img.height;
  const canvas = new Canvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);

  for (let y = 0; y < width; y++) {
    let row = `    (`;
    for (let x = 0; x < height; x++) {
      const data = ctx.getImageData(x, y, 1, 1).data;
      const color = Color(`rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`);
      const char = colorMap.get(color.rgb().string());
      row = `${row} ${char}`;
    }
    row = `${row})`;
    console.log(row);
  }
}

function printFilesScss(data) {
  console.log(`$pixel-art: (`);
  Object.keys(data).forEach(file => {
    console.log(`  ${file}: (`)
    printImage(data[file]);
    console.log(`  ),`)
  });
  console.log(`);`);
}

printFilesScss(files);
