const path = require('path'),
  fetch = require('node-fetch'),
  cheerio = require('cheerio');

const { createDirIfNotExist, getRelease, getTimeFormatted, writeToFile } = require("./util");

module.exports = function (filePath, fileName, versionURL) {
  const baseDir = path.resolve(filePath);

  return async function (result) {
    const dir = baseDir + path.sep + getTimeFormatted();

    createDirIfNotExist(baseDir);
    createDirIfNotExist(dir);

    let version = "";
    if (versionURL) {
      let body = await fetch(versionURL).then(resp => resp.text());
      let versionPage = cheerio.load(body);

      version = ` ${getRelease(versionPage)}` || "";
    }

    writeToFile(`${dir + path.sep + fileName + version}.txt`,
      result.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join("\n").trim());
  }
};