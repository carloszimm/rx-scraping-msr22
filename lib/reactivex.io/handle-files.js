const fs = require('fs'),
  csv = require('fast-csv'),
  path = require('path'),
  { DateTime } = require("luxon");

const { DeepSet } = require("./utils")

const baseDir = path.resolve("result/reactivex.io");

function writeData(result, coreOpsCategory, bar) {
  const dir = baseDir + path.sep + DateTime.now().toISO({ format: 'basic', includeOffset: false });

  // checks directory existence
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const csvStream = csv.format({ headers: true, writeBOM: true });
  csvStream
    .pipe(fs.createWriteStream(dir + path.sep + 'summary.csv', { encoding: 'utf-8' }))
    .on('finish', () => {
      bar.increment(7);
    });

  // map[distribution]operators
  let opsByDistribution = new Map();

  result.data.forEach(val => {
    let data = [
      ["Operator", val.operator],
      ["URL", val.url],
      ["Operator(URL)", val.operatorInPage]
    ];

    result.distributions.forEach(dist => {
      if (!opsByDistribution.has(dist)) {
        opsByDistribution.set(dist, new DeepSet());
      }

      let ops = val.distributions.get(dist) || [];
      ops.forEach(op =>
        opsByDistribution.get(dist).add({
          operator: op,
          coreOperator: val.operatorInPage,
          category: coreOpsCategory.get(val.operatorInPage)
        })
      );

      ops = ops.join("; ");
      data.push([dist, ops]);
    });

    csvStream.write(data);
  });

  csvStream.end();

  writeDataByDistribution(opsByDistribution, dir, bar);
}

function writeDataByDistribution(opsByDistribution, dir, bar) {

  let opsByDistArray = [];

  opsByDistribution.forEach((val, key) => {

    let sortedData = [...val]
      .filter(x => x.operator !== "")
      .sort((a, b) => a.operator.localeCompare(b.operator, undefined, { sensitivity: 'base' }));

    let removedRepeatedData = [...new Set(sortedData.map(a => a.operator))]

    // write data as json
    fs.writeFile(dir + path.sep + key + '.json', JSON.stringify(removedRepeatedData),
      err => {
        if (err) throw err;
        bar.increment(3);
      });

    // write data as txt
    fs.writeFile(dir + path.sep + key + '.txt', removedRepeatedData.join("\n").trim(),
      err => {
        if (err) throw err;
        bar.increment(4);
      });

    opsByDistArray.push({
      distribution: key,
      operators: sortedData
    })
  });

  // writes a general mapping of all operators and their core operators + categories
  fs.writeFile(dir + path.sep + 'general_mapping.json', JSON.stringify(opsByDistArray),
    err => {
      if (err) throw err;
    });
}

module.exports = writeData;