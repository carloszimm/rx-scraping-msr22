const fetch = require('node-fetch'),
  cheerio = require('cheerio'),
  cliProgress = require('cli-progress');

const { createGroups, removeText } = require("./utils"),
  writeData = require("./handle-files");

const mainUrl = "http://reactivex.io";

const categories = [
  { name: "Creating Observables", id: "creating" },
  { name: "Transforming Observables", id: "transforming" },
  { name: "Filtering Observables", id: "filtering" },
  { name: "Combining Observables", id: "combining" },
  { name: "Error Handling Operators", id: "error" },
  { name: "Observable Utility Operators", id: "utility" },
  { name: "Conditional and Boolean Operators", id: "conditional" },
  { name: "Mathematical and Aggregate Operators", id: "mathematical" },
  { name: "Backpressure Operators", id: "backpressure" },
  { name: "Connectable Observable Operators", id: "connectable" },
  { name: "Operators to Convert Observables", id: "conversion" }
];

// configure multibar
const multibar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true,
  autopadding: true,
  format: "Promise {promiseN} [{bar}] {percentage}% | {operator} | {value}/{total}"
}, cliProgress.Presets.legacy);
multibar.on("stop", () => console.log("Scraping complete"));

// list: elements representing the operators and their links
async function getInfoPages(list, promiseN) {

  let result = {
    distributions: new Set(),
    data: []
  };

  const bar = multibar.create(list.length, 0, { promiseN });

  for (let i = 0; i < list.length; i++) {
    const li = list.eq(i);
    const anchor = li.children("a");

    bar.increment({ operator: anchor.text() });

    result.data.push({
      operator: anchor.text(),
      url: mainUrl + anchor.attr("href"),
      operatorInPage: "",
      distributions: new Map()
    });

    let resp = await fetch(mainUrl + anchor.attr("href"));
    let body = await resp.text();
    let operatorPage = cheerio.load(body);

    result.data[i].operatorInPage = operatorPage("li[class='active']").text().trim();

    let anchors = operatorPage("#accordion div[id^='heading'] a");

    //goes through the anchors containing data about operators of distributions
    for (let j = 0; j < anchors.length; j++) {
      let distAnchor = anchors.eq(j);
      let distribution = removeText(distAnchor);

      //fix inconsistencies
      if (distribution === "RxJava 2x") {
        distribution = "RxJava 2․x";
      } else if (distribution === "RxNet") {
        distribution = "RxNET";
      }

      result.distributions.add(distribution);
      result.data[i].distributions.set(distribution, distAnchor.children("code").text().split(/\s+/));
    }
  }
  return result;
}

async function scrapeRxDoc() {
  let resp = await fetch(`${mainUrl}/documentation/operators.html`);
  let body = await resp.text();
  let operatorsPage = cheerio.load(body);

  // operators classification
  let coreOpsCategory = buildCoreOpsCategory(operatorsPage);

  let list = operatorsPage("#alphabetical ~ ul li");

  console.log(`Scraping ReactiveX(${mainUrl.split("//")[1]})...`);

  let data = await Promise.all(createGroups(list, 4)
    .map((chunk, index) => getInfoPages(chunk, index + 1)));

  multibar.stop();

  const bar = new cliProgress.SingleBar({
    format: `Processing results(${mainUrl.split("//")[1]}) [{bar}] {percentage}%`,
    stopOnComplete: true
  }, cliProgress.Presets.legacy);
  bar.on("stop", () => console.log(" Done"));

  bar.start(100, 0);

  let finalResult = data.reduce((prev, curr) => {
    prev.distributions = new Set([...prev.distributions].concat([...curr.distributions]));
    prev.data = prev.data.concat(curr.data);
    return prev;
  }, { distributions: new Set(), data: [] });

  bar.increment(7);

  //save results to file
  writeData(finalResult, coreOpsCategory, bar);
}

function buildCoreOpsCategory(operatorsPage) {

  let coreOpsCategory = new Map();

  categories.forEach(val => {
    let ul = operatorsPage(`#${val.id} ~ ul`).eq(0)
    let opsName = ul.find("strong")

    for (let i = 0; i < opsName.length; i++) {
      coreOpsCategory.set(opsName.eq(i).text().trim(), val.name)
    }
  });

  return coreOpsCategory;
}

module.exports = scrapeRxDoc;