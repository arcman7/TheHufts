
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

function queryYahooAPI(symbol){
    var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22"+ symbol + "%22%20and%20startDate%20%3D%20%222014-06-11%22%20and%20endDate%20%3D%20%222015-09-14%22&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    var request = $.ajax({
      url: query,
      method: 'get'
    })

    request.done(function(response){
      console.log(response);
    })
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