var fs = require('fs');

function queryYahooAPI(symbol){
  // Initialize something to return;
  var stockData = null;

  // This will always be the same
  var rootPath = 'https://query.yahooapis.com/v1/public/yql?q=';

  // I think this is a lot easier to read, it's more SQL-like, then we can 
  // just run it through JS's native URI encoder. Also super easy to just
  // drop in new queries through params (for future)
  var query = 'select * from yahoo.finance.quotes where symbol = "' + symbol + '"';

  // These will also always be the same, as far as I understand.
  var extraParams = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

  // Build the full query URL here - whole point is to make the query itself more flexible if
  // we need to change it later. Note I'm encoding the query string
  var fullQuery = rootPath + encodeURIComponent(query) + extraParams;

  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var request = new XMLHttpRequest();
  request.open('GET', fullQuery, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      stockData = JSON.parse(request.responseText);

      stockData = parseYahooAPIResults(stockData);
      
      writeToFile(stockData);
    } else {
      console.log("Server error");
    }
  };

  request.onerror = function() {
    console.log("Error: Could not connect")
  };

  request.send();

  // return stockData;

}

function parseYahooAPIResults(data) {
  // Here we just list the metrics we want
  var metrics = ["symbol", "LastTradePriceOnly", "Volume"];

  data = data["query"]["results"]["quote"];

  Object.keys(data).forEach(function(key){
    // Delete the key-value pair if the key is not one of the metrics
    if (metrics.indexOf(key) === -1)
      delete data[key];
  });

  return data;
}

function writeToFile(results) {

  results = JSON.stringify(results);

  fs.writeFile("resultstest.txt", results, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("File saved.");
  }); 
}

queryYahooAPI(process.argv[2]);


