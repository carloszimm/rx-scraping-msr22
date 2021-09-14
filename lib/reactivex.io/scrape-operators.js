const fetch = require('node-fetch'),
  cheerio = require('cheerio'),
  cliProgress = require('cli-progress');

const { createGroups, removeText } = require("./utils"),
  writeData = require("./handle-files");

const mainUrl = "http://reactivex.io";

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

    result.data[i].operatorInPage = operatorPage("ol[class='breadcrumb'] + h1").text();

    let anchors = operatorPage("#accordion div[id^='heading'] a");

    //goes through the anchors containing data about distribution operators
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
  writeData(finalResult, bar);
}

module.exports = scrapeRxDoc;