function sort(a,b){ //sorts buy / sell signals
  if (a[0] < b[0])
    return -1;
  if (a[0] > b[0])
    return 1;
  return 0;
}

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
