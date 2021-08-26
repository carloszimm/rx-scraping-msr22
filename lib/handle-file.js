const fs = require('fs'),
  path = require('path'),
  { DateTime } = require("luxon"),
  fetch = require('node-fetch'),
  cheerio = require('cheerio');

const { getRelease } = require("./util");

module.exports = function (filePath, fileName, versionURL) {
  const baseDir = path.resolve(filePath);

  return async function (result) {
    const dir = baseDir + path.sep + DateTime.now().toISO({ format: 'basic', includeOffset: false });

    // checks directory existence
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir);
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    let body = await fetch(versionURL).then(resp => resp.text());
    let versionPage = cheerio.load(body);

    const version = ` ${getRelease(versionPage)}` || "";

    fs.writeFile(`${dir + path.sep + fileName + version}.txt`,
      result.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join("\n").trim(),
      err => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      });
  }
};