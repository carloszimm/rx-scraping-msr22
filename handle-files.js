const fs = require("fs"),
  csv = require('fast-csv');

const path = __dirname + "/data";

function writeData(result, bar) {
  // checks directory existence
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }

  const csvStream = csv.format({ headers: true, writeBOM: true });
  csvStream
    .pipe(fs.createWriteStream(path + '/result.csv', { encoding: 'utf-8' }))
    .on('finish', () => {
      bar.increment(7);
    });

  let opsByDistribution = new Map();

  result.data.forEach(val => {
    let data = [
      ["Operator", val.operator],
      ["URL", val.url],
      ["Operator in Page", val.operatorInPage]
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

  writeDataByDistribution(opsByDistribution, bar);
}

function writeDataByDistribution(opsByDistribution, bar) {
  opsByDistribution.forEach((val, key) => {
    fs.writeFile(path + `/${key}.txt`, [...val].sort().join("\n").trim(), (err) => {
      if (err) throw err;
      bar.increment(7);
    })
  })

}

module.exports = writeData;