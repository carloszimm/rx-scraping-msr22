const fetch = require('node-fetch'),
  cheerio = require('cheerio'),
  cliProgress = require('cli-progress');

const writeData = require("../handle-file")
  ("result/RxKotlin", "", "https://github.com/ReactiveX/RxKotlin/releases");

const mainUrl = "https://github.com/ReactiveX/RxKotlin";

const id = "#user-content-extensions";

function processElems(elem) {
  let ops = new Set();

  for (let i = 0; i < elem.length; i++) {
    ops.add(elem.eq(i).text().replace("()", "").trim());
  }

  return [...ops];
}

async function scrapeRxKotlin(rxJavaOperators) {
  let resp = await fetch(mainUrl);
  let body = await resp.text();
  let operatorsPage = cheerio.load(body);

  const bar = new cliProgress.SingleBar({
    format: `Scraping RxKotlin(${mainUrl.split("//")[1]}) [{bar}] {percentage}% {status}`,
    stopOnComplete: true
  }, cliProgress.Presets.legacy);

  bar.start(100, 0, { status: "" });

  let rxKotlinOperators = processElems(operatorsPage(id).parent().next().find("td:nth-child(2)"));
  rxKotlinOperators = [...new Set(rxKotlinOperators.concat(rxJavaOperators))];

  bar.increment(50, { status: "Processing results" });
  await writeData(rxKotlinOperators);

  bar.increment(50, { status: "Done" });
}

module.exports = scrapeRxKotlin;