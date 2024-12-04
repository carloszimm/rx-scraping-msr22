# ReactiveX Operators Scraping
Provides scripts to extract ReactiveX operators from official Rx libraries sources.
Scripts used for the following paper during the 19th International Conference on Mining Software Repositories (MSR '22):
> Mining the Usage of Reactive Programming APIs: A Mining Study on GitHub and Stack Overflow.

Complementary scripts, also utilized during the paper production, are available in:
* [GitHub Mining](https://github.com/carloszimm/gh-mining-msr22)
* [Stack Overflow Mining](https://github.com/carloszimm/so-mining-msr22)

The following sources are currently scraped (extracted):
* http://reactivex.io/ (ReactiveX website)
* https://github.com/ReactiveX/rxdart/ (RxDart repository)
* https://github.com/ReactiveX/RxGo/ (RxGo repository)
* https://github.com/ReactiveX/RxJava (RxJava repository)
* https://github.com/ReactiveX/rxjs/ (RxJS repository)
* https://github.com/ReactiveX/RxKotlin (RxKotlin repository)

For the purposes of the paper, only the operators of **RxJava** (RxJava repository), **RxJS** (RxJS repository), and **RxSwift** (ReactiveX website) were utilized.

## Requirements
The script relies on Node.js to execute it. Therefore, the **Node.js v14.17.5 or superior** must be installed.

## Installation
After cloning, install the dependencies before the first usage 
```terminal
npm install
```

## Usage
```terminal
node scrape
```

## Results
All the results are output in the [result folder](https://github.com/carloszimm/rxoperators-scraping/tree/main/result). For each running, the script will generate a subfolder in `result` folder indicating a current timestamp following the format pattern: `year-month-day hour-min-sec.millisec`.
