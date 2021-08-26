const fetch = require('node-fetch'),
  cheerio = require('cheerio'),
  cliProgress = require('cli-progress');

const writeData = require("../handle-file")
  ("result/RxGo", "rxgo", "https://github.com/ReactiveX/RxGo/releases");
const { getList } = require("../util");

const mainUrl = "https://github.com/ReactiveX/RxGo";

const ids = [
  "#user-content-creating-observables", //Creating Observables
  "#user-content-transforming-observables", //Transforming Observables
  "#user-content-filtering-observables", //Filtering Observables
  "#user-content-combining-observables", //Combining Observables
  "#user-content-error-handling-operators", //Error Handling Operators
  "#user-content-observable-utility-operators", //Observable Utility Operators
  "#user-content-conditional-and-boolean-operators", //Conditional and Boolean Operators
  "#user-content-mathematical-and-aggregate-operators", //Mathematical and Aggregate Operators
  "#user-content-operators-to-convert-observables" //Operators to Convert Observables
];

function processElems(elem) {
  let ops = [];

  for (let i = 0; i < elem.length; i++) {
    ops.push(elem.eq(i).text());
  }

  return ops;
}

async function scrapeRxGo() {
  let resp = await fetch(mainUrl);
  let body = await resp.text();
  let operatorsPage = cheerio.load(body);

  const bar = new cliProgress.SingleBar({
    format: `Scraping RxGo(${mainUrl.split("//")[1]}) [{bar}] {percentage}% {status}`,
    stopOnComplete: true
  }, cliProgress.Presets.legacy);

  bar.start(100, 0);

  let rxGoOperators = ids
    .reduce((prev, curr) => {
      bar.increment(10);
      return prev.concat(processElems(getList(operatorsPage(curr))));
    }, []);

  bar.update(null, { status: "Processing results" });
  await writeData(rxGoOperators);

  bar.increment(10, { status: "Done" });
}

module.exports = scrapeRxGo;