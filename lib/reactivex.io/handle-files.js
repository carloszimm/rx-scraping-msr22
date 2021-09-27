const path = require('path');

const { createDirIfNotExist, getTimeFormatted, writeToFile } = require("../util");

const baseDir = path.resolve("result/reactivex.io");

// write data as json
function writeJSON(path, data) {
  writeToFile(path, JSON.stringify(data));
}

// write data as txt
function writeTXT(path, data) {
  writeToFile(path, data.join("\n").trim());
}

async function writeData(result) {
  const dir = baseDir + path.sep + getTimeFormatted();

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

  writeJSON(dir + path.sep + 'categorized.json', categorizedArray);
}

module.exports = writeData;