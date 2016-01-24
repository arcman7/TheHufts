//this file depends on crypto js being loaded first
function encrypt(string,key){
  var encrypted = CryptoJS.AES.encrypt(string,key).toString();
  return encrypted;
}

function decrypt(string,key){
  var decrypted = CryptoJS.AES.decrypt(string, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

var yousuck = " Please refresh the page and try again.";
var userAlgoFunctions = {};

function testAlgoOutput(algoString){
  console.log(algoString);
  algoFunction1 = new Function('return ' + algoString);
  algoFunction1 = algoFunction1();
  //var output = eval(algoString);
  //var testArray = [["1",2],["2",3],["3",1],["4",4],["5",5],["6",6],["7",5],["8",4],["9",5]];
  var testArray = [[1426464000000, 2.76],[1426550400000, 2.77],[1426636800000, 2.75],[1426723200000, 2.74],[1426809600000, 2.8],[1427068800000, 2.84],[1427155200000, 2.79],[1427241600000, 2.63],[1427328000000, 2.65],[1427414400000, 2.72],[1427673600000, 2.7],[1427760000000, 2.68],[1427846400000, 2.69],[1427932800000, 2.69],[1428278400000, 2.7],[1428364800000, 2.7],[1428451200000, 2.71],[1428537600000, 2.72],[1428624000000, 2.76],[1428883200000, 2.78],[1428969600000, 2.67],[1429056000000, 2.7],[1429142400000, 2.87],[1429228800000, 2.58],[1429488000000, 2.49],[1429574400000, 2.35],[1429660800000, 2.28],[1429747200000, 2.33],[1429833600000, 2.3],[1430092800000, 2.34],[1430179200000, 2.31],[1430265600000, 2.28],[1430352000000, 2.26],[1430438400000, 2.31],[1430697600000, 2.31],[1430784000000, 2.28],[1430870400000, 2.29],[1430956800000, 2.32],[1431043200000, 2.31],[1431302400000, 2.32],[1431388800000, 2.35],[1431475200000, 2.37],[1431561600000, 2.33],[1431648000000, 2.32],[1431907200000, 2.35],[1431993600000, 2.28],[1432080000000, 2.32],[1432166400000, 2.28],[1432252800000, 2.28],[1432598400000, 2.22],[1432684800000, 2.28],[1432771200000, 2.27],[1432857600000, 2.28],[1433116800000, 2.25],[1433203200000, 2.3],[1433289600000, 2.28],[1433376000000, 2.33],[1433462400000, 2.33],[1433721600000, 2.31],[1433808000000, 2.29],[1433894400000, 2.32],[1433980800000, 2.32],[1434067200000, 2.31],[1434326400000, 2.32],[1434412800000, 2.35],[1434499200000, 2.47],[1434585600000, 2.52],[1434672000000, 2.58],[1434931200000, 2.62], [1435017600000, 2.61],[1435104000000, 2.62],[1435190400000, 2.58],[1435276800000, 2.47],[1435536000000, 2.34],[1435622400000, 2.4],[1435708800000, 2.42],[1435795200000, 2.53],[1436140800000, 2.47],[1436227200000, 2.09],[1436313600000, 2.01],[1436400000000, 1.98],[1436486400000, 1.96],[1436745600000, 1.96],[1436832000000, 2.05],[1436918400000, 1.96],[1437004800000, 1.87],[1437091200000, 1.79],[1437350400000, 1.8],[1437436800000, 1.8],[1437523200000, 1.79],[1437609600000, 1.76],[1437696000000, 1.67],[1437955200000, 1.62],[1438041600000, 1.77],[1438128000000, 1.96],[1438214400000, 1.93],[1438300800000, 1.93],[1438560000000, 2.2],[1438646400000, 2.13],[1438732800000, 2.16],[1438819200000, 2.11],[1438905600000, 2.09],[1439164800000, 1.93],[1439251200000, 1.9],[1439337600000, 1.9],[1439424000000, 1.79],[1439510400000, 1.84],[1439769600000, 1.8],[1439856000000, 1.8],[1439942400000, 1.8],[1440028800000, 1.7],[1440115200000, 1.78],[1440374400000, 1.75],[1440460800000, 1.66],[1440547200000, 1.72],[1440633600000, 1.78],[1440720000000, 1.85],[1440979200000, 1.81],[1441065600000, 1.71],[1441152000000, 1.77],[1441238400000, 1.79],[1441324800000, 1.82],[1441670400000, 1.88],[1441756800000, 1.85],[1441843200000, 1.84],[1441929600000, 2.01],[1442188800000, 1.82],[1442275200000, 1.86],[1442361600000, 1.89],[1442448000000, 1.89],[1442534400000, 1.87],[1442793600000, 1.81],[1442880000000, 1.73],[1442966400000, 1.7],[1443052800000, 1.72],[1443139200000, 1.71],[1443398400000, 1.66],[1443484800000, 1.67],[1443571200000, 1.72],[1443657600000, 1.74],[1443744000000, 1.83],[1444003200000, 1.8],[1444089600000, 1.83],[1444176000000, 1.86],[1444262400000, 1.93],[1444348800000, 1.96],[1444608000000, 1.87],[1444694400000, 1.92],[1444780800000, 1.95],[1444867200000, 1.97],[1444953600000, 1.94],[1445212800000, 2.01],[1445299200000, 2.02],[1445385600000, 2.1],[1445472000000, 2.14],[1445558400000, 2.21],[1445817600000, 2.15],[1445904000000, 2.15],[1445990400000, 2.18],[1446076800000, 2.13],[1446163200000, 2.12],[1446422400000, 2.19],[1446508800000, 2.28],[1446595200000, 2.2],[1446681600000, 2.2],[1446768000000, 2.15],[1447027200000, 2.11],[1447113600000, 2.02],[1447200000000, 2.07],[1447286400000, 2],[1447372800000, 1.99],[1447632000000, 1.99],[1447718400000, 1.98],[1447804800000, 2.12],[1447891200000, 2.14],[1447977600000, 2.22],[1448236800000, 2.22],[1448323200000, 2.34],[1448409600000, 2.38],[1448582400000, 2.33],[1448841600000, 2.36],[1448928000000, 2.34],[1449014400000, 2.27],[1449100800000, 2.23],[1449187200000, 2.28],[1449446400000, 2.36],[1449532800000, 2.39],[1449619200000, 2.35],[1449705600000, 2.45],[1449792000000, 2.36],[1450051200000, 2.34],[1450137600000, 2.36],[1450224000000, 2.54],[1450310400000, 2.56],[1450396800000, 2.45],[1450656000000, 2.53],[1450742400000, 2.77],[1450828800000, 2.83],[1450915200000, 2.92],[1451260800000, 3],[1451347200000, 3],[1451433600000, 2.98],[1451520000000, 2.87],[1451865600000, 2.77],[1451952000000, 2.75],[1452038400000, 2.51],[1452124800000, 2.28],[1452211200000, 2.14]];
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

function checkLogin(){

   var request = $.ajax({
      url: protocol + "//" + domain + "/checkLogin",
      type: "get",
      data: {domain: domain, protocol: protocol},
      success: function(data, textStatus) {
        if (data.redirect) {
            // data.redirect contains the string URL to redirect to
            window.location.href = data.redirect;
        }
        else{
          //continue with uploading the algorithm
        }
      }
    });
}

function saveAlgo(data,filename){
  var request = $.ajax({
      url: protocol + "//" + domain+"/saveAlgo",
      type:"post",
      data: {data: data}
  });

  request.done(function (response){
    console.log(response);
    $("#uploaded-algos-container").append('<tr class="'+filename+'"><td><button id="'+filename+'TheHufts"><i class="fa fa-eye"></i></button></td><td><strong style="color:#1ab394">'+filename+'</strong></td><td></td><td>$ <input type="integer" name="principal" class="'+filename+'" value="100.00"></td><td><a id="'+filename+'"><i class="fa fa-line-chart text-navy">Run</i></td><td><a class="killRow"><i class="fa fa-times"></i></div></a></td></tr>');
    $("table.table.table-striped td").css({'padding-left':'0px'});
    $("table.table.table-striped td").css({'padding-right':'0px'});
    // $("#uploaded-algos-container").append('<tr class="'+filename+'"><td>'+filename+' </td><td>$</td><td><input type="integer" name="principal" class="'+filename+'" value="100.00"></td><td></td><td><a id="'+filename+'"><i class="fa fa-line-chart text-navy"> Run</i></a></td><td><a class="killRow"><i class="fa fa-times"></i></a></td></tr>');
    algoTesterListener('#'+filename);
    inspectSourceCode(filename+"TheHufts");
  });//end done function
}

function queryGateKeeper(data,callback,filename){
  data = JSON.stringify(data);
  var gateKeeperURL = protocol + "//" + domain + "/gateKeeper/knockKnock";

  $.ajax({
          url: gateKeeperURL,
          type: "get"
  }).
  done(function(response){
    var key = response;
    data = encrypt(data, key);
    var confirmation = encrypt("TheHufts",key);
    callback(data,filename);
  });
}


function uploadFileListener(){
  document.getElementById('file-upload').onchange = function(){
    checkLogin(); //checks if the users session is active
    var file = this.files[0];

    var reader = new FileReader();
    reader.onload = function(progressEvent){
      // Entire file
      //console.log(this.result);
      // By lines
     // var lines = this.result.split('\n');
      var fileType =  file.name.split('.').pop();
      var algoScript = this.result;
      if(fileType == "js"){
        var results    = testAlgoOutput(algoScript); //returns [true], if the algo passed
      }
      else{
        var results = [ true ];
      }
      //console.log(fileType);


      if(results[0]){
        // var fileType =  file.name.split('.').pop();
        var filename = file.name.split('.')[0];
        var password = prompt("Password confirmation: ", "password");
        //console.log(password);
        //console.log(algoScript);
        var encryptedAlgoString = encrypt(algoScript,password);
        //userAlgoFunctions[filename] = encryptedAlgoString;
        var data = {algo: encryptedAlgoString, name: filename, fileType: fileType, password: password, confirmation: "TheHufts"};
        queryGateKeeper(data,saveAlgo,filename);
        //console.log(fileType)
        }//end if results[0]
      else{
        alert(results[1]);
        return;
      }
    };
    reader.readAsText(file);

    // var filename = file.name.split('.')[0]
    // $("#uploaded-algos-container").append('<tr><td> '+ filename +' </td><td></td><td><a id="'+ filename +'"><i class="fa fa-line-chart text-navy"> Run</i></a></td><td><a class="killRow"><i class="fa fa-times"></i></a></td></tr>');
    // //$("#uploaded-algos-container").append(html_string);
    // algoTesterListener('#'+filename);
  };//end .onchange function
}

function inspectSourceCode(algoId){
  $("#uploaded-algos-container").on('click','#'+algoId,function (e){
    e.preventDefault();
    var url = protocol + "//" + domain + "/passAlgoFile";
    var username = String(window.location).split('=')[1];
    var algoName = algoId.split("TheHufts")[0];
    //console.log(algoName);
    var data = { username: username, algoName: algoName};
    var request = $.ajax({
      url: url,
      type: "post",
      data: data
    });

    request.done(function (response){
        response = JSON.parse(response);
        var fileType = response.fileType;
        var text = decrypt(response.algoFile, window.access_key);
          //set text-area for code pad to be generated from
        $('#code1').text(text);
        $('.codemirror').remove();
          //update codemirror pad
        var newCodeMirror = CodeMirror.fromTextArea(document.getElementById('code1'), {
            mode: "javascript",
            theme: "default",
            lineNumbers: true,
            readOnly: true
        });  //end codemirror
        newCodeMirror.setSize(800, 900);
      });//end done function

    request.fail(function (error){
      console.log(error);
    })
  });//end on click
}



function getUsersAlgoNames (){
  //var accessKey = prompt("Please confirm with your access key: ", "access-key");
  var username = String(window.location).split('=')[1];

  $.ajax({
    url: protocol + "//" + domain + "/getAlgoNames",
    type: "post",
    data: {username: username}
  })
  .done(function(response){
    //console.log(response,typeof(response));
    response = JSON.parse(response);
    console.log(response);
    if(response.names){
       response.names.forEach(function (algoName){
        var filename = algoName;
        //$("#uploaded-algos-container").append('<tr class="'+algoName+'"><td>'+ algoName+' </td><td>$</td><td><input type="integer" name="principal" class="'+algoName+'" value="100.00"></td><td><a id="'+algoName+'"><i class="fa fa-line-chart text-navy"> Run</i></a></td><td><a class="killRow"><i class="fa fa-times"></i></a></td></tr>');
       $("#uploaded-algos-container").append('<tr class="'+filename+'"><td><button id="'+filename+'TheHufts"><i class="fa fa-eye"></i></button></td><td><strong style="color:#1ab394">'+filename+'</strong></td><td></td><td>$ <input type="integer" name="principal" class="'+filename+'" value="100.00"></td><td><a id="'+algoName+'"><i class="fa fa-line-chart text-navy">Run</i></td><td><a class="killRow"><i class="fa fa-times"></i></div></a></td></tr>');
       $("table.table.table-striped td").css({'padding-left':'0px'});
       $("table.table.table-striped td").css({'padding-right':'0px'});
        algoTesterListener('#'+algoName);
        inspectSourceCode(algoName+'TheHufts');
       });
    }

  }).fail(function (error){
   console.log("failed to get algo names from server, " + JSON.stringify(error));
  });
}


function pluginAlgoResults(calculations){
  var returnValue = calculations.netValue[calculations.netValue.length-1][1] - calculations.netValue[0][1];
  var previousReturn = calculations.netValue[calculations.netValue.length-1][1] - calculations.netValue[calculations.netValue.length-2][1];
  var directionR = returnValue > 0 ? "up" : "down";
  var colorR     = returnValue > 0 ? "info" : "danger";
  returnValue = returnValue.toFixed(2); previousReturn = previousReturn.toFixed(2);

  var return1 = '<div class="ibox float-e-margins"><div class="ibox-title"><h5>Return</h5></div><div class="ibox-content"><h1 class="no-margins">$'+returnValue;
  var return2 = '</h1><div class="stat-percent font-bold text-'+ colorR +'">$'+ previousReturn + '<i class="fa fa-level-'+ directionR +'"></i></div><small>Last Trade</small></div></div>';

  $("#return").html(return1 + return2);


  var percentageValue = calculations.netValue[calculations.netValue.length-1][1] / calculations.netValue[0][1] - 1;
  var previousPercentage = calculations.netValue[calculations.netValue.length-1][1] / calculations.netValue[calculations.netValue.length - 2][1] - 1;
  var directionP = previousPercentage > 0 ? "up" : "down";
  var colorP     = previousPercentage > 0 ? "info" : "danger";
  percentageValue *= 100; previousPercentage *= 100;
  percentageValue = percentageValue.toFixed(0); previousPercentage = previousPercentage.toFixed(0);
  var percentage1 = '<div class="ibox float-e-margins"><div class="ibox-title"><h5>Percentage Gain</h5></div><div class="ibox-content"><h1 class="no-margins">' + percentageValue;
  var percentage2 ='%</h1><div class="stat-percent font-bold text-' + colorP +'">'+ previousPercentage +'%<i class="fa fa-level-'+ directionP +'"></i></div><small>Previous Position</small></div></div>';


  $("#percentage").html(percentage1 + percentage2);

  var balance1 = '<div class="ibox float-e-margins"><div class="ibox-title"><h5>Balance</h5></div><div class="ibox-content"><h1 class="no-margins">$';
  var balance2 ='</h1><small>Current Balance</small></div></div>';
  var balanceValue  = calculations.netCash[calculations.netCash.length-1][1].toFixed(2);
  $("#balance").html(balance1 + balanceValue + balance2);
}


function algoTesterListener(algoId){
  $("#uploaded-algos-container").on('click',algoId,function(e){
    e.preventDefault();
    console.log('worked');
    var username = String(window.location).split('=')[1];

    if(globalSymbol){
      //new Promise(resolve,reject){
        var endDate = yahooDateString();
        var d = new Date();
        var d300ago = new Date(d - 300*3600*1000*24);
        var startDate = yahooDateString(d300ago);
        var filename = algoId.slice(1);
        var data = {username: username, filename: filename, accessKey: "huffer", "symbols": JSON.stringify([ globalSymbol] ), startDate: startDate, endDate: endDate, domain: domain, protocol: protocol};
        //console.log(data);
        $(algoId).html('<i class="fa fa-cog fa-spin"></i>');
        var request = $.ajax({
              url: protocol + "//" + domain + "/hufterAPI",
              type: "post",
              data: data
            }).done(function (response){
              //console.log(response);
               var hufterData = response[globalSymbol]["signals"];
               // console.log(hufterData);

               var series = formatSeries(globalSymbol,algoId,hufterData);
               //console.log(series);
               graphHome([],$(".graph"),"Day ",series,globalSymbol);
               var dollarAmount = $('#uploaded-algos-container input.'+filename+'[name="principal"]').val();

               hufterData.buy = hufter2HighchartsDATA(hufterData.buy);
               hufterData.sell = hufter2HighchartsDATA(hufterData.sell);
               var options = {
                  principal: ( Number(dollarAmount) || 100 ),
                  percentage: 100,
                  signals: {buy: hufterData.buy, sell: hufterData.sell},
                }
               console.log(options.signals);
               results = applyCash(options);
               console.log(results)
               graphHome(results.netValue, $(".results"),"Day ", undefined,globalSymbol);
               pluginAlgoResults(results);
               $(".results").css("padding","1px");
               $(".results").css("border","1px solid black");
               $(algoId).html('<i class="fa fa-line-chart text-navy"> Run</i>');
            });
        //resolve(request)
      //}).then(function(response))
    }
    else{
      swal("Wait!", "Shouldn't you search a stock first so your algorithm will run against something?", "error");
    }
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

function sort(a,b){ //sorts buy / sell signals
  if (a[0] < b[0])
    return -1;
  if (a[0] > b[0])
    return 1;
  return 0;
}

function hufter2HighchartsDATA(array){
  mappedData = [];
  array.forEach(function (tupleArray){
  mappedData.unshift( [Number(new Date(tupleArray[0])), Number(tupleArray[1])] );
  });
  return mappedData.sort(sort);
}

function formatSeries(symbol,filename,buySellSignals){
  var series = [];
  var scale = "Day"
  buySellSignals.buy = hufter2HighchartsDATA(buySellSignals.buy);
  buySellSignals.sell = hufter2HighchartsDATA(buySellSignals.sell);
  console.log("format series: ",buySellSignals)
  series.push({
           id  : scale + "price",
           name: scale + "price",
           data: processedStockData[symbol],
       });
  //call algoFunction on stock data:
  //var buySellSignals = algoFunction1(processedStockData[symbol]);

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
    //"shape"     : "url(https://mt.google.com/vt/icon?psize=20&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-a.png&ax=44&ay=48&scale=1&text=%E2%80%B2)",
    shape       : "circlepin",
    "data"      : buyFlagSeries,
    showInLegend: true,
    //color       : "#1eaa56",
    color       : Highcharts.getOptions().colors[0],
    name        : "Buy",
    title       : "B",
    style       : { color: 'white'},
    fillColor   : "#2884e0"
   });

  series.push(
   {
    "type"      :"flags",
    "onSeries"  : scale + "price",
    "shadow"    : false,
    "width"     : 7,
    //"shape"     : "url(https://camo.githubusercontent.com/b4f21ebe4ad7c00f459e8ed115e6efb37fe69348/687474703a2f2f63686172742e676f6f676c65617069732e636f6d2f63686172743f636873743d645f6d61705f70696e5f6c65747465722663686c643d7c464630303030)",
    shape       : "circlepin",
    "data"      : sellFlagSeries,
    showInLegend: true,
    //color       : "#f20000",
    color       : "#326d23",
    name        : "Sell",
    title       : "S",
    style       : { color: 'black'},
    fillColor   : "#18a689"
   });

  return series //contains regular stock data in addition to the newly generated signals
 }//end generateSignals



var deleteRow = function() {
  $("#uploaded-algos-container").on("click",".killRow",function(event) {
      event.preventDefault();
      var td = $(this).parent();
      var tr = td.parent();
      tr.remove();
  });
};


function applyCash(options){
  //options = {principal,percentage,buySellSignals,fee}
  options.percentage = options.percentage || 100;
  var netCash = options.principal;
  var per = options.percentage / 100; //easier syntax
  var signals = options.signals; //easier syntax
  var length = signals.buy.length;
  var shares = 0;
  var netValue = netCash;
  var fee = 0;
  if(options.transactionFee){
    fee = options.transactionFee;
  }

  //3 arrays for tracking netCash,netValue, shares
  var historicalValues = {};
  historicalValues.netCash  = [];
  historicalValues.netValue = [];
  historicalValues.shares   = [];

  var possiblyPurchased;//how many stocks can be purchased at given moment

  for(var i = 0; i<length; i++){
    var currentTime = signals.buy[i][0];

    if(i < length-1){
      var nextBuyTime = signals.buy[i+1][0];
      signals.sell.forEach(function (sell,j){
        if( currentTime <= sell[0] && sell[0] <= nextBuyTime ){
          netCash += sell[1]*shares - fee;
          shares  -= shares;
          historicalValues.netCash.push([sell[0],netCash]);
          historicalValues.shares.push([sell[0],shares]);
          netValue = netCash + shares*sell[1];
          historicalValues.netValue.push([sell[0],netValue]);
        }
       //console.log(j,sell[0]);
      });
    }
    if(netCash > 0){
      possiblyPurchased = Math.floor( (netCash-fee)*per / signals.buy[i][1]);
      if(possiblyPurchased >= 1){
        netCash -= possiblyPurchased*signals.buy[i][1] - fee;
        shares  += possiblyPurchased;
      }
    }//end if-netCash > 0
    netValue = netCash + shares*signals.buy[i][1];
    historicalValues.netCash.push([currentTime,netCash]);
    historicalValues.netValue.push([currentTime,netValue]);
    historicalValues.shares.push([currentTime,shares]);

    //sort the results
    historicalValues.netCash.sort(sort);
    historicalValues.netValue.sort(sort);
    historicalValues.shares.sort(sort);
  }//end i - for loop;
  return historicalValues;
}//end applyCash function


$(document).on('ready',function(){
  deleteRow();
  uploadFileListener();//Note: when this event is fired it has the effect of producing addtional listeners
  getUsersAlgoNames();
});//end document ready

