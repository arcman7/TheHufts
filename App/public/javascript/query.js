//module.exports = (function(){

//GLOBAL VARIABLES
    //GLOBAL::Variables to be used by algorithms
    var processedStockData ={};
    var globalSymbol;

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
           color        : "red",
           name         : "Sell"
       },
       credits: {
           enabled: false
       },

    });
}

function yahooDateString(date){
  if(!date){
    var year  = (new Date()).getFullYear();
    var day   = (new Date()).getDate();
    var month = (new Date()).getMonth()+1;
  }
  else{
    var year  = date.getFullYear();
    var day   = date.getDate();
    var month = date.getMonth()+1;
  }
  if (String(month).length < 2){ month = "0" + month;}
  if (String(day).length   < 2){ day   = "0" + day;  }
  //console.log(month,month.length,day,day.length);
  return year+"-"+month+"-"+day;
}
function queryYahooAPI(symbol,callback,container,options){

    if(!options){
      var options ={};
      options.end   = yahooDateString();
      var d = new Date();
      var d300ago = new Date(d - 300*3600*1000*24);
      options.start = yahooDateString(d300ago);
    }
    var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22"+ symbol + "%22%20and%20startDate%20%3D%20%22"+options.start+"%22%20and%20endDate%20%3D%20%22"+options.end+"%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    var request = $.ajax({
      url: query,
      method: 'get'
    })

    request.done(function(response){

      var goodQuery = ( response["query"]["results"] != null );

      if (goodQuery){
        result = callback(response["query"]["results"]["quote"]);
        processedStockData[symbol] = result;
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

function hufter2HighchartsDATA(array){
  mappedData = [];
  array.forEach(function (tupleArray){
  mappedData.unshift([Number(new Date(tupleArray[0])),Number(tupleArray[1])]);
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
    $(".graph").css("width","100%");
    $(".graph").css("background","url('http://3.bp.blogspot.com/-FjddXJJsIv8/VeaoXmv8HQI/AAAAAAAAGww/PlCl0uSR_9g/s1600/loading.gif')");
  });
}


$(document).on('ready',function(){
  symbolListener();
});

//})//end anon global export function
