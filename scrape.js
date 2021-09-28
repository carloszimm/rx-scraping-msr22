const scrapeRxDoc = require("./lib/reactivex.io/scrape-operators"),
  scrapeRxGo = require("./lib/rxgo/scrape-operators"),
  scrapeRxDart = require("./lib/rxdart/scrape-operators"),
  scrapeRxJS = require("./lib/rxjs/scrape-operators"),
  scrapeRxJava = require("./lib/rxjava/scrape-operators"),
  scrapeRxKotlin = require("./lib/rxkotlin/scrape-operators");

async function main() {
  scrapeRxDoc();
  scrapeRxDart();
  scrapeRxGo();
  scrapeRxJS();
  const rxJavaOpertors = await scrapeRxJava();
  scrapeRxKotlin(rxJavaOpertors);
}

main();