
//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'

// var http = require('http');


//  function queryYahooAPI(symbol){
//     var query = "/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22"+ symbol + "%22%20and%20startDate%20%3D%20%222014-06-11%22%20and%20endDate%20%3D%20%222015-09-14%22&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

//     var options = {
//       host: 'https://query.yahooapis.com',
//       path: query
//     };

//     callback = function(response) {
//         var str = '';

//         //another chunk of data has been recieved, so append it to `str`
//         response.on('data', function (chunk) {
//           str += chunk;
//         });

//         //the whole response has been recieved, so we just print it out here
//         response.on('end', function () {
//           console.log(str);
//         });
//     }

//     http.request(options, callback).end();
// }

//GLOBAL VARIABLES
    //GLOBAL::Variables to be used by algorithms
    var processedStockData ={};

function graphHome(array,container,scale) {
    $(container).css("overflow","auto");

    $(container).highcharts('StockChart',{
        rangeSelector: {
           allButtonsEnabled: true,
           selected: 2,
           //inputDateFormat: '%Y-%m-%d'
        },

        title: {
            text: (' Price Data')
        },

        tooltip: {
            valuePrefix: '$'
        },

         xAxis: {
            time: [scale],
            type: 'datetime',
            },

        yAxis: {
            title: {
                text: 'Price'
            }
        },
        series: [{
            name: scale + "price",
            data: array
        }]
    });
}

function queryYahooAPI(symbol,callback,container){
    var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22"+ symbol + "%22%20and%20startDate%20%3D%20%222014-06-11%22%20and%20endDate%20%3D%20%222015-09-14%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    var request = $.ajax({
      url: query,
      method: 'get'
    })

    request.done(function(response){

      var goodQuery = ( response["query"]["results"] != null );

      if (goodQuery){
        result = callback(response["query"]["results"]["quote"]);
        processedStockData[symbol] = result;
        graphHome(result,container,"Day");
      }
      else{
        alert("The stock "+ symbol + " does not exsist. Please find the correct ticker symbol.");
      }

    });
}

function yahooJson2HighchartsDATA(arrayOfJson){
  mappedData = [];
  arrayOfJson.forEach(function(qouteObject){ //1st - make date time object from string, 2nd - convert it to decimal form
    mappedData.unshift([Number(new Date(qouteObject["Date"])),Number(qouteObject["Close"])]);
  });
  return mappedData;
}

// (function(){

//  var queryYahooAPI = function(symbol){
//   var query = "/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22"+ symbol + "%22%20and%20startDate%20%3D%20%222014-06-11%22%20and%20endDate%20%3D%20%222015-09-14%22&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

//   var options = {
//     host: 'https://query.yahooapis.com',
//     path: query
//   };

//   callback = function(response) {
//     var str = '';

//     //another chunk of data has been recieved, so append it to `str`
//     response.on('data', function (chunk) {
//       str += chunk;
//     });

//     //the whole response has been recieved, so we just print it out here
//     response.on('end', function () {
//       console.log(str);
//     });
//   }

//   http.request(options, callback).end();
// }
//   return {
//     queryYahooAPI:queryYahooAPI
//   }
// })

function symbolListener(){
  $('#stock-form-container').on('click','.submit',function(event){
    event.preventDefault();
    var symbol = $('#stockSymbol').val().toUpperCase();;
    var data = queryYahooAPI(symbol, yahooJson2HighchartsDATA,$(".graph"));
    $(".graph").html("");
    $(".graph").css("display",'block');
    $(".graph").css("height","30em");
    $(".graph").css("width","60%");
    $(".graph").css("background","url('http://3.bp.blogspot.com/-FjddXJJsIv8/VeaoXmv8HQI/AAAAAAAAGww/PlCl0uSR_9g/s1600/loading.gif')");
  });
}

$(document).on('ready',function(){
  symbolListener();
});