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
    .pipe(fs.createWriteStream(path + `/result.csv`, { encoding: 'utf-8' }))
    .on('finish', () => {
      bar.update(100);
      bar.stop();
    });

  result.data.forEach(val => {

    let data = [
      ["Operator", val.operator],
      ["URL", val.url],
      ["Operator in Page", val.operatorInPage]
    ];

    result.distributions.forEach(dist => {
      let ops = val.distributions.get(dist) || [];
      ops = ops.join("; ");
      data.push([dist, ops]);
    });
    
    csvStream.write(data);
  });

  csvStream.end();
}

module.exports = writeData;