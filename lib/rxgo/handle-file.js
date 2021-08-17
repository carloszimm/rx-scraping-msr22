const fs = require('fs'),
  path = require('path'),
  { DateTime } = require("luxon"),
  fetch = require('node-fetch'),
  cheerio = require('cheerio');

const versionURL = "https://github.com/ReactiveX/RxGo/releases";

const baseDir = path.resolve("result/RxGo");

async function writeData(result) {
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

  const version = " " + versionPage("div[class='release-entry']").eq(0).find("a").eq(1).text().trim() || "";

  fs.writeFile(`${dir + path.sep}rxgo${version}.txt`,
    result.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join("\n").trim(),
    err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
}

module.exports = writeData;