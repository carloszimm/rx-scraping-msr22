const scrapeRxDoc = require("./lib/reactivex.io/scrape-operators"),
  scrapeRxGo = require("./lib/rxgo/scrape-operators"),
  scrapeRxDart = require("./lib/rxdart/scrape-operators"),
  scrapeRxJS = require("./lib/rxjs/scrape-operators"),
  scrapeRxJava = require("./lib/rxjava/scrape-operators"),
  scrapeRxKotlin = require("./lib/rxkotlin/scrape-operators");

async function main() {
  await scrapeRxDoc();
  await scrapeRxDart();
  await scrapeRxGo();
  await scrapeRxJS();
  const rxJavaOpertors = await scrapeRxJava();
  scrapeRxKotlin(rxJavaOpertors);
}

main();