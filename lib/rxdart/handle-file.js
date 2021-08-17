const fs = require('fs'),
  path = require('path'),
  { DateTime } = require("luxon");

const baseDir = path.resolve("result/RxDart");

function writeData(result) {
  const dir = baseDir + path.sep + DateTime.now().toISO({ format: 'basic', includeOffset: false });

  // checks directory existence
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(dir + path.sep + 'rxdart.txt',
    result.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join("\n").trim(),
    err => {
      if (err) throw err;
    });
}

module.exports = writeData;