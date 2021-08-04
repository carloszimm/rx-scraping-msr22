const fs = require('fs'),
  csv = require('fast-csv'),
  path = require('path');

const baseDir = __dirname + path.sep + "result";

function writeData(result, bar) {
  let dir = baseDir + path.sep + new Date().toISOString().replace("T", " ").replace(/:/g, "-");

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

  let opsByDistribution = new Map();

  result.data.forEach(val => {
    let data = [
      ["Operator", val.operator],
      ["URL", val.url],
      ["Operator(URL)", val.operatorInPage]
    ];

    result.distributions.forEach(dist => {
      if (!opsByDistribution.has(dist)) {
        opsByDistribution.set(dist, new Set());
      }
      let ops = val.distributions.get(dist) || [];
      ops.forEach(val => opsByDistribution.get(dist).add(val));
      ops = ops.join("; ");
      data.push([dist, ops]);
    });

    csvStream.write(data);
  });

  csvStream.end();

  writeDataByDistribution(opsByDistribution, dir, bar);
}

function writeDataByDistribution(opsByDistribution, dir, bar) {
  opsByDistribution.forEach((val, key) => {
    fs.writeFile(dir + path.sep + key + '.txt',
      [...val].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join("\n").trim(),
      err => {
        if (err) throw err;
        bar.increment(7);
      })
  })

}

module.exports = writeData;