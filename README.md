# ReactiveX Operators Scraping
Provides a script to scrape the information about ReactiveX operators from official Rx Distribuition sources.

The following sources are currently scraped:
* http://reactivex.io/ (ReactiveX website)
* https://github.com/ReactiveX/rxdart/ (RxDart repository)
* https://github.com/ReactiveX/RxGo/ (RxGo repository)
* https://github.com/ReactiveX/rxjs/ (RxJS repository)

## Installation
After cloning, install the dependencies before the first usage 
```terminal
npm install
```

## Usage
```terminal
node scrape-operators
```

## Results
All the results are output in the [result folder](https://github.com/carloszimm/rxoperators-scraping/tree/main/result). For each running, the script will generate a subfolder in `result` folder indicating a current timestamp following the format pattern: `year-month-day hour-min-sec.millisec`.
