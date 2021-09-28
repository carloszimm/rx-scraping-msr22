const scrapeRxDoc = require("./lib/reactivex.io/scrape-operators"),
  scrapeRxGo = require("./lib/rxgo/scrape-operators"),
  scrapeRxDart = require("./lib/rxdart/scrape-operators"),
  scrapeRxJS = require("./lib/rxjs/scrape-operators"),
  scrapeRxJava = require("./lib/rxjava/scrape-operators");

async function main() {
  scrapeRxDoc();
  scrapeRxDart();
  scrapeRxGo();
  scrapeRxJS();
  scrapeRxJava();
}

main();