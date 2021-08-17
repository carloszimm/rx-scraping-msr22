const fetch = require('node-fetch'),
  cheerio = require('cheerio'),
  cliProgress = require('cli-progress');

const writeData = require("./handle-file");

const mainUrl = "https://github.com/ReactiveX/rxdart";

const ids = [
  "#user-content-list-of-classes--static-factories", //List of Classes / Static Factories
  "#user-content-list-of-extension-methods", //List of Extension Methods
];

const getList = page => page.parent().next().find("li a");

function processElems(elem) {
  let ops = new Set();

  for (let i = 0; i < elem.length; i++) {
    ops.add(elem.eq(i).text().replace(/[0-9]/g, ''));
  }

  return ops;
}

async function scrapeRxDart() {
  let resp = await fetch(mainUrl);
  let body = await resp.text();
  let operatorsPage = cheerio.load(body);

  const bar = new cliProgress.SingleBar({
    format: `Scraping RxDart(${mainUrl.split("//")[1]}) [{bar}] {percentage}% {status}`,
    stopOnComplete: true
  }, cliProgress.Presets.legacy);

  bar.start(100, 0);

  let rxDartOperators = ids
    .reduce((prev, curr) => {
      bar.increment(35);
      return new Set([...prev].concat([...processElems(getList(operatorsPage(curr)))]));
    }, new Set());

  bar.update(null, { status: "Processing results" });
  writeData([...rxDartOperators]);

  bar.increment(35, { status: "Done" });
}

module.exports = scrapeRxDart;