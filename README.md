# ReactiveX Operators Scraping
Provides a script to scrape the information about ReactiveX operators from the official [ReactiveX website](http://reactivex.io/). The operators are gathered through the list of
alphabetically ordered operators contained in the [docs](http://reactivex.io/documentation/operators.html) of ReactiveX.

The general goal of this scraping script is to facilitate the research and development surrounding the reactive programming paradigm.

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
All the results are output in the `result` folder. For each running, the script will generate a subfolder in `result` folder indicating a current timestamp following the format
pattern: `year-month-day hour-min-sec.millisec`. The script creates one CSV file called `summary` that output the information collected from the scraping in a general way, and
it also produces one TXT file for every ReactiveX distribution containing their repective operators as the file content (already ordered and removed the possible duplicates).
<br/>**Headers of the `summary` file:**
* **Operator**: The actual name displayed on the ReactiveX documentation
* **URL**: The URL provided for the operator. This URL may point to a page with a different operator name but having the same meaning/semantic
* **Operator(URL)**: The operator name displayed on the page of the above URL
* **[Rx Distribution]**: Collumns containing the operator's variations according to a Rx Distribution (RxClojure, RxJS, RxKotlin, etc).

The [result folder](https://github.com/carloszimm/rxoperators-scraping/tree/main/result) has an example of a last result output.

## Implementation Notes
The script breaks the operators' list in 4 parts and assign a different promise for each part, aiming to improve the script performance by parallelizing the work. The progress of
the scraping can be checked out by progress bars shown in the console:
![progress_bar1](https://user-images.githubusercontent.com/4553211/128657575-6f8e1a07-3dfa-4ab6-82b8-f98ce9adaa52.png)

The last execution yielded a total of **454** operators listed on the ReactiveX docs.

After scraping the operators, the result is processed and the files written:
![progress_bar2](https://user-images.githubusercontent.com/4553211/128657483-9028f076-7753-42a8-88b9-5913f512c92a.png)
