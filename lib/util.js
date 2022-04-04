const fs = require('fs'),
  { DateTime } = require('luxon');

const createDirIfNotExist = dir => {
  // checks directory existence
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

// write data as json
const writeJSON = (path, data) => {
  writeToFile(path + ".json", JSON.stringify(data));
}

// write data as txt
const writeTXT = (path, data) => {
  writeToFile(path + ".txt", data.join("\n").trim());
}

const writeToFile = (path, data) => {
  fs.writeFile(path, data,
    err => {
      if (err) throw err;
    });
}

const getTimeFormatted = () => DateTime.now().toISO({ includeOffset: false }).replace("T", " ").replace(/:/g, "-");

const getList = page => page.parent().nextAll("ul").first().find("li a");

const getRelease = page => {
  let result = page("svg[class~='octicon'] + span[class~='ml-1']").first().text().trim();
  if (!result || result == "") {
    result = page("h4[class~='commit-title'] a")
      .first().text().trim();
  }
  return result;
}

module.exports = {
  createDirIfNotExist,
  getList,
  getRelease,
  getTimeFormatted,
  writeJSON,
  writeToFile,
  writeTXT
};