const fetch = require('node-fetch'),
  cheerio = require('cheerio'),
  cliProgress = require('cli-progress');

const writeData = require("./handle-files");

const multibar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true,
  autopadding: true,
  format: "Promise {promiseN} [{bar}] {percentage}% | {operator} | {value}/{total}"
}, cliProgress.Presets.legacy);

const mainUrl = "http://reactivex.io";

//solution based on
//https://stackoverflow.com/questions/3442394/using-text-to-retrieve-only-text-not-nested-in-child-tags
function removeText(elem) {
  return elem.clone()    //clone the element
    .children() //select all the children
    .remove()   //remove all the children
    .end()  //again go back to selected element
    .text()
    .trim();
}

// function based on https://typeofnan.dev/how-to-split-an-array-into-a-group-of-arrays-in-javascript/
function createGroups(arr, numGroups) {
  const perGroup = Math.ceil(arr.length / numGroups);
  return new Array(numGroups)
    .fill('')
    .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
}

// list: list of elements representing the operators and their links
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

async function main() {
  let resp = await fetch(`${mainUrl}/documentation/operators.html`);
  let body = await resp.text();
  let operatorsPage = cheerio.load(body);

  let list = operatorsPage("#alphabetical ~ ul li");

  console.log("Scraping Reactivex Operators...");

  let data = await Promise.all(createGroups(list, 4)
    .map((chunk, index) => getInfoPages(chunk, index + 1)));

  multibar.stop();
  console.log("Scraping Completed!\n");

  const bar = new cliProgress.SingleBar({
    format: 'Processing results [{bar}] {percentage}%',
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

main();