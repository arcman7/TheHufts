var processedStockData ={};
var globalSymbol;
function graphHome(array,container,scale,series,symbol){
  $(container).css("overflow","auto");
   var title = symbol + ' Price Data';

  if(!series){
     series = [{
         id  : scale + "price",
         name: scale + "price",
         data: array
     }];
  }
  $(container).highcharts('StockChart',{
    rangeSelector: {
       allButtonsEnabled: true,
       selected: 2,
       //inputDateFormat: '%Y-%m-%d'
    },

    title: {
        text: title
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

    series: series,
    // series: [{
    //     name: scale + "price",
    //     data: array
    // }]
    legend: {
       enabled      : true,
       floating     : true,
       align        : 'left',
       verticalAlign: 'top',
   },
   credits: {
       enabled: false
   },
 });
}

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache

/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);

/***/ },
/* 1 */
/***/ function(module, exports) {

	//module.exports = (function(){

	//GLOBAL VARIABLES
	    //GLOBAL::Variables to be used by algorithms
	    // var processedStockData ={};
	    // var globalSymbol;

	function graphHome(array,container,scale,series,symbol) {
	    $(container).css("overflow","auto");
	     var title = symbol + ' Price Data';

	    if(!series){
	       series = [{
	           id  : scale + "price",
	           name: scale + "price",
	           data: array
	       }];
	    }

	    //console.log(series)
	    $(container).highcharts('StockChart',{
	        rangeSelector: {
	           allButtonsEnabled: true,
	           selected: 2,
	           //inputDateFormat: '%Y-%m-%d'
	        },

	        title: {
	            text: title
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

	        series: series,
	        // series: [{
	        //     name: scale + "price",
	        //     data: array
	        // }]
	        legend: {
	           enabled      : true,
	           floating     : true,
	           align        : 'left',
	           verticalAlign: 'top',
	       },
	       credits: {
	           enabled: false
	       },
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
	        console.log(processedStockData);

	        graphHome(result,container,"Day",undefined,symbol);
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



	function symbolListener(){
	  $('#stock-form-container').on('click','.submit',function(event){
	    event.preventDefault();
	    var symbol = $('#stockSymbol').val().toUpperCase();
	    globalSymbol = symbol;
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

	//})//end anon global export function


/***/ },
/* 2 */
/***/ function(module, exports) {

	//module.exports = (function(){

	Parse.initialize(parseSecret1, parseSecret2);

	var Algo = Parse.Object.extend("Algo");
	var algo = new Algo();
	var yousuck = " Please refresh the page and try again.";
	var algoFunction1;
	function testAlgoOutput(algoString){
	  algoFunction1 = new Function('return ' + algoString);
	  algoFunction1 = algoFunction1();
	  //var output = eval(algoString);
	  var testArray = [["1",2],["2",3],["3",1],["4",4],["5",5],["6",6],["7",5],["8",4],["9",5]];
	  output = algoFunction1(testArray);
	  console.log(output);
	  var errorMessage = "";

	    if (typeof(output) == "object"){
	      if(output["buy"] && output["sell"]){
	        if ( (output["buy"].constructor == Array) && (output["sell"].constructor == Array) ){
	          var buy0 = output["buy"][0];
	          var sell0 = output["sell"][0];
	          if ((buy0.constructor == Array) && (sell0.constructor == Array) ){
	            if (Number(buy0[1]) > 0 && Number(sell0[1]) > 0){

	              if (buy0[0] && sell0[0]){
	                return [true];
	              }else{
	                errorMessage ="The first value (index 0) inside of your nested arrays must be valid time stamp values.";
	              }//end fith-nested if
	            }else{
	              errorMessage = "The second value (index 1) inside of your nested arrays must be valid price values.";
	            }//end forth-nested if
	          }else{
	            errorMessage = "The objects inside of the 'buy' and 'sell' arrays must also be arrays, for example: { buy: [ [time0,price0], [time1,price1], ...] }. The nested arrays must contain time and price values respectively.";
	          }//end third-nested if
	        }else{
	          errorMessage = "The object returned from your algorithm function must have the key(s) 'buy' and 'sell'. Both of the keys must point to array values.";
	        }//end second-nested if
	      }else{
	        errorMessage = "The object returned from your algorithm function must contain the keys 'buy' and 'sell'.";
	      }//end second-and-a-half if
	    }else{
	      errorMessage = "The output/return value of your algorithm function is not of type object. Don't forget to invoke your function at the end of the script ;-)";
	    }//end first if
	  return [false, errorMessage + yousuck];
	}

	function blockEval(string){
	  var key = {};
	  var stringArray = string.split('');
	  var stringCopy = stringArray;
	  stringArray.forEach(function(charr,index){
	    if(index % 2 == 0){
	      key[index] = charr;
	      stringCopy[index] = Math.round(Math.random()*9);
	    }
	  });
	  return [stringCopy,key];
	}

	function uploadFileListener(){
	  document.getElementById('file-upload').onchange = function(){

	    var file = this.files[0];

	    var reader = new FileReader();
	    reader.onload = function(progressEvent){
	      // Entire file
	      //console.log(this.result);

	      // By lines
	     // var lines = this.result.split('\n');

	      var algoScript = this.result;
	      //console.log(algoScript);
	      var results = testAlgoOutput(algoScript);
	      if(results[0]){
	        var algoPair = blockEval(algoScript);
	        var algoFile = algoPair[0].join('');
	        var algoKey = JSON.stringify(algoPair[1]);
	        algo.set("algoFile",algoFile);
	        algo.set("algoKey",algoKey);
	        algo.save(null, {
	              success: function(algo) {
	          //     // Execute any logic that should take place after the object is saved.
	          //     //alert('New object created with objectId: ' + algo.id);
	          //     //console.log('New object created with objectId: ' + algo.id);
	                 alert("You have successfully saved an encripted version of your algorithm in your account.");
	              },
	              error: function(algo, error) {
	          //     // Execute any logic that should take place if the save fails.
	          //     // error is a Parse.Error with an error code and message.
	               alert('Failed to create new object, with error code: ' + error.message);
	             }
	           });//end save function
	      }else{
	        alert(results[1]);
	      }

	      //eventually we'll have:
	      //algo.set("user_id",num)
	    };
	    reader.readAsText(file);
	    $("#uploaded-algos-container").append("<button id='algo1'>Test algo-1</button>");
	    algoTesterListener();
	  };//end .onchange function
	}

	function algoTesterListener(algoId){
	  $("#algo1").on('click',function(){
	  	 console.log("test algo clicked");
	      var series = generateSignals(globalSymbol);
	      graphHome([],$(".graph"),"Day",series,globalSymbol);
	      //clearing mysterious 'A' text value from markers
	      // $("#highcharts-6 > svg > g.highcharts-series-group > g > g > text").text('');
	      //edit: The 'A' still fucking comes back anytime you adjust the graph!?
	  });
	}

	function generateSignals(symbol){
	  var series = [];
	  var scale = "Day"

	  series.push({
	           id  : scale + "price",
	           name: scale + "price",
	           data: processedStockData[symbol],
	       });
	  //call algoFunction on stock data:
	  var buySellSignals = algoFunction1(processedStockData[symbol]);
	  var buyFlagSeries = buySellSignals.buy.map(function(signal,index){
	    return {
	              "x"   : signal[0],
	              "text": "bought at: $"+ signal[1],
	              "id"  : "bflag-"+index,
	           }//end return
	  });
	  var sellFlagSeries = buySellSignals.sell.map(function(signal,index){
	    return {
	              "x"   : signal[0],
	              "text": "sold at: $"+ signal[1],
	              "id"  : "sflag-"+index,
	           }//end return
	  });

	  series.push(
	   {
	    "type"      : "flags",
	    "onSeries"  : scale + "price",
	    "shadow"    : false,
	    "width"     : 7,
	    "shape"     : "url(https://mt.google.com/vt/icon?psize=20&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=48&scale=1&text=%E2%80%B2)",
	    "data"      : buyFlagSeries,
	    showInLegend: true,
	    color       : "#1eaa56",
	    name        : "Buy"
	   });

	  series.push(
	   {
	    "type"      :"flags",
	    "onSeries"  : scale + "price",
	    "shadow"    : false,
	    "width"     : 7,
	    "shape"     : "url(https://camo.githubusercontent.com/b4f21ebe4ad7c00f459e8ed115e6efb37fe69348/687474703a2f2f63686172742e676f6f676c65617069732e636f6d2f63686172743f636873743d645f6d61705f70696e5f6c65747465722663686c643d7c464630303030)",
	    "data"      : sellFlagSeries,
	    showInLegend: true,
	    color       : "#f20000",
	    name        : "Sell"

	     // radius: 6,
	     // fillColor: '#f20000',
	     // lineWidth: 2,
	     // lineColor: null, // inherit from series
	     // symbol   :'circle',
	     // shape    :"circle",
	     // states: {
	     //     hover: {
	     //         fillColor: null,
	     //         lineWidth: 2,
	     //       radius:6
	     //     }
	     // }
	   });

	  return series //contains regular stock data in addition to the newly generated signals
	 }//end generateSignals
	$(document).on('ready',function(){
	  uploadFileListener();//Note: when this event is fired it has the effect of producing addtional listeners
	   var username = "Sir.Badass";
     var password = "biscuits";
     $.ajax({
          url: "http://localhost:3000/gateKeeper/knockKnock",
          type: "get"
      }).done(function(response){
          var key = response;
          var test = CryptoJS.AES.encrypt(username, key).toString();

          //var test2 = CryptoJS.AES.decrypt(test, key).toString(CryptoJS.enc.Utf8);
          //console.log(decrypted.toString(CryptoJS.enc.Utf8),username);
          var confirmation = CryptoJS.AES.encrypt("TheHufts",key).toString();
          $.ajax({
            url: "http://localhost:3000/login/login",
            type: "post",
            data: { encrypted: test, confirmation: confirmation }
          }).done(function(response){ console.log(response); } );
        })
	});

	//})//end anon global function





/***/ }
/******/ ]);