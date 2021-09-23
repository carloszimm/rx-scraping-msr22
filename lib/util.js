const fs = require('fs'),
  { DateTime } = require('luxon');

const createDirIfNotExist = dir => {
  // checks directory existence
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

const getTimeFormatted = () => DateTime.now().toISO({ includeOffset: false }).replace("T", " ").replace(/:/g, "-");

const getList = page => page.parent().nextAll("ul").first().find("li a");

const getRelease = page => page("div[class='release-entry'] div[class~='release-main-section']")
  .first().find("a").first().text().trim();

module.exports = {
  createDirIfNotExist,
  getList,
  getRelease,
  getTimeFormatted
};