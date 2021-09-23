const fs = require('fs'),
  path = require('path'),
  { DateTime } = require('luxon');

const baseDir = path.resolve("result/reactivex.io");

function createDirIfNotExist(dir) {
  // checks directory existence
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

// write data as json
function writeJSON(path, data) {
  fs.writeFile(path, JSON.stringify(data),
    err => {
      if (err) throw err;
    });
}

// write data as txt
function writeTXT(path, data) {
  fs.writeFile(path, data.join("\n").trim(),
    err => {
      if (err) throw err;
    });
}

// writes a general mapping of all operators and their core operators + categories
function writeCategorizedData(path, data) {
  fs.writeFile(path, JSON.stringify(data),
    err => {
      if (err) throw err;
    });
}

async function writeData(result) {
  const dir = baseDir + path.sep + DateTime.now().toISO({ format: 'basic', includeOffset: false });

  createDirIfNotExist(baseDir);
  createDirIfNotExist(dir);

  let categorizedArray = [];

  result.forEach((val, key) => {

    const sortedData = [...val]
      .sort((a, b) => a.operator.localeCompare(b.operator, undefined, { sensitivity: 'base' }));

    let removedRepeatedData = [...new Set(sortedData.map(a => a.operator))];

    writeJSON(dir + path.sep + key + '.json', removedRepeatedData);
    writeTXT(dir + path.sep + key + '.txt', removedRepeatedData);

    categorizedArray.push({
      distribution: key,
      operators: sortedData
    })
  });

  writeCategorizedData(dir + path.sep + 'categorized.json', categorizedArray);
}

module.exports = writeData;