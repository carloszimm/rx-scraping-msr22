const fetch = require('node-fetch'),
  cheerio = require('cheerio'),
  cliProgress = require('cli-progress');

const writeData = require("../handle-file")
  ("result/RxJS", "rxjs", "https://github.com/ReactiveX/rxjs/releases");
const { getList } = require("../util");

const mainUrl = "https://github.com/ReactiveX/rxjs",
  resource = "/blob/master/docs_app/content/guide/operators.md";

const ids = [
  "#user-content-creation-operators-1", //Creation Operators
  "#user-content-join-creation-operators", //Join Creation Operators
  "#user-content-transformation-operators", //Transformation Operators
  "#user-content-filtering-operators", //Filtering Operators
  "#user-content-join-operators", //Join Operators
  "#user-content-multicasting-operators", //Multicasting Operators
  "#user-content-error-handling-operators", //Error Handling Operators
  "#user-content-utility-operators", //Utility Operators
  "#user-content-conditional-and-boolean-operators", //Conditional and Boolean Operators
  "#user-content-mathematical-and-aggregate-operators" //Mathematical and Aggregate Operators
];

function processElems(elem) {
  let ops = [];

  for (let i = 0; i < elem.length; i++) {
    ops.push(elem.eq(i).text());
  }

  return ops;
}

async function scrapeRxJS() {
  let resp = await fetch(mainUrl + resource);
  let body = await resp.text();
  let operatorsPage = cheerio.load(body);

  const bar = new cliProgress.SingleBar({
    format: `Scraping RxJS(${mainUrl.split("//")[1]}) [{bar}] {percentage}% {status}`,
    stopOnComplete: true
  }, cliProgress.Presets.legacy);

  bar.start(100, 0);

  let rxJSOperators = ids
    .reduce((prev, curr) => {
      bar.increment(9);
      return prev.concat(processElems(getList(operatorsPage(curr))));
    }, []);

  bar.update(null, { status: "Processing results" });
  await writeData(rxJSOperators);

  bar.increment(10, { status: "Done" });
}

module.exports = scrapeRxJS;