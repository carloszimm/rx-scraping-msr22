const scrapeRxDoc = require("./lib/reactivex.io/scrape-operators"),
  scrapeRxGo = require("./lib/rxgo/scrape-operators");

async function main(){
    await scrapeRxDoc();
    scrapeRxGo();
}

main();