const path = require('path');

const { createDirIfNotExist, getTimeFormatted, writeJSON, writeTXT } = require("../util");

const baseDir = path.resolve("result/reactivex.io");

async function writeData(result) {
  const dir = baseDir + path.sep + getTimeFormatted();

  createDirIfNotExist(baseDir);
  createDirIfNotExist(dir);

  let categorizedArray = [];

  result.forEach((val, key) => {

    const sortedData = [...val]
      .sort((a, b) => a.operator.localeCompare(b.operator, undefined, { sensitivity: 'base' }));

    let removedRepeatedData = [...new Set(sortedData.map(a => a.operator))];

    writeJSON(dir + path.sep + key, removedRepeatedData);
    writeTXT(dir + path.sep + key, removedRepeatedData);

    categorizedArray.push({
      distribution: key,
      operators: sortedData
    })
  });

  writeJSON(dir + path.sep + 'categorized', categorizedArray);
}

module.exports = writeData;