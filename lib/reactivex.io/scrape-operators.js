const fetch = require('node-fetch'),
  cheerio = require('cheerio'),
  cliProgress = require('cli-progress');;

const { removeText, DeepSet } = require("./utils"),
  writeData = require("./handle-files");

const mainUrl = "http://reactivex.io";

const categories = [
  { name: "Creating", id: "creating" },
  { name: "Transforming", id: "transforming" },
  { name: "Filtering", id: "filtering" },
  { name: "Combining", id: "combining" },
  { name: "Error Handling", id: "error" },
  { name: "Utility", id: "utility" },
  { name: "Conditional and Boolean", id: "conditional" },
  { name: "Mathematical and Aggregate", id: "mathematical" },
  { name: "Backpressure", id: "backpressure" },
  { name: "Connectable", id: "connectable" },
  { name: "Conversion", id: "conversion" }
];

const bar = new cliProgress.SingleBar({
  format: `Scraping Rx Doc(${mainUrl.split("//")[1]}) [{bar}] {percentage}%`,
  stopOnComplete: true
}, cliProgress.Presets.legacy);
bar.on("stop", () => console.log(" Done"));

// list: elements representing the operators and their links
async function getInfoPage(url) {

  let result = new Map();

  let body = await fetch(mainUrl + url).then(resp => resp.text());
  let operatorPage = cheerio.load(body);

  let anchors = operatorPage("#accordion div[id^='heading'] a");

  //goes through the anchors containing data about operators of the distributions
  for (let j = 0; j < anchors.length; j++) {
    let distAnchor = anchors.eq(j);
    let distribution = removeText(distAnchor);

    //fix inconsistencies
    if (distribution === "RxJava 2x") {
      distribution = "RxJava 2․x";
    } else if (distribution === "RxNet") {
      distribution = "RxNET";
    }

    let operators = distAnchor.children("code").text().trim();
    if (operators !== "") {
      let opsArray = operators.split(/\s+/);
      opsArray = opsArray.map(op => op.replace(/[_a-zA-Z][_a-zA-Z0-9]*\./, ""));
      result.set(distribution, opsArray);
    }
  }

  return result;
}

async function scrapeRxDoc() {
  let body = await fetch(`${mainUrl}/documentation/operators.html`).then(resp => resp.text());
  let operatorsPage = cheerio.load(body);

  let dist = new Map();

  bar.start(categories.length);

  for (cat of categories) {

    let ul = operatorsPage(`#${cat.id} ~ ul`).first();
    let coreOps = ul.find("a");

    const values = await Promise.all(
      coreOps.map((_, elem) => getInfoPage(operatorsPage(elem).attr("href"))).get());

    // values: [distribution => [operators]]
    values.forEach((val, index) => {
      for (const [key, value] of val) {
        const coreOperator = coreOps.eq(index).children("strong").first().text().trim();

        let opsSet;
        if (!dist.has(key)) {
          opsSet =
            new DeepSet(value.map(op => newOperator(op, coreOperator, cat.name)));
        } else {
          opsSet =
            new DeepSet([...dist.get(key)].concat(value.map(op => newOperator(op, coreOperator, cat.name))));
        }
        dist.set(key, opsSet);
      }
    });

    bar.increment();
  }

  //save results to files
  writeData(dist);

  return dist;
}

function newOperator(operator, coreOperator, category) {
  return { operator, coreOperator, category };
}

module.exports = scrapeRxDoc;