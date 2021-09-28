const fetch = require('node-fetch'),
  cheerio = require('cheerio'),
  cliProgress = require('cli-progress');

const writeData = require("../handle-file")
  ("result/RxJava", "rxjava", "https://github.com/ReactiveX/RxJava/releases");

const mainUrl = "https://github.com/ReactiveX/RxJava/wiki/Operator-Matrix";

const id = "table[role='table'] tr > td:first-child";

function processElems(elem) {
  let ops = new Set();

  //cut off the last line of table
  for (let i = 0; i < elem.length - 1; i++) {
    ops.add(elem.eq(i).text().trim());
  }

  return [...ops];
}

async function scrapeRxJava() {
  let resp = await fetch(mainUrl);
  let body = await resp.text();
  let operatorsPage = cheerio.load(body);

  const bar = new cliProgress.SingleBar({
    format: `Scraping RxJava(${mainUrl.split("//")[1]}) [{bar}] {percentage}% {status}`,
    stopOnComplete: true
  }, cliProgress.Presets.legacy);

  bar.start(100, 0, { status: "" });

  let rxJavaOperators = processElems(operatorsPage(id));

  bar.increment(50, { status: "Processing results" });
  await writeData(rxJavaOperators);
  bar.increment(50, { status: "Done" });

  return rxJavaOperators;
}

module.exports = scrapeRxJava;