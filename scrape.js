const scrapeRxDoc = require("./lib/reactivex.io/scrape-operators"),
  scrapeRxGo = require("./lib/rxgo/scrape-operators"),
  scrapeRxDart = require("./lib/rxdart/scrape-operators");

async function main() {
  await scrapeRxDoc();
  await scrapeRxGo();
  scrapeRxDart();
}

main();