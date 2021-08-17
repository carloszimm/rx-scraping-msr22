const fs = require('fs'),
  path = require('path'),
  { DateTime } = require("luxon");

const baseDir = path.resolve("result/RxGo");

function writeData(result) {
  const dir = baseDir + path.sep + DateTime.now().toISO({ format: 'basic', includeOffset: false });

  // checks directory existence
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(dir + path.sep + 'rxgo.txt',
    result.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join("\n").trim(),
    err => {
      if (err) throw err;
    });
}

module.exports = writeData;