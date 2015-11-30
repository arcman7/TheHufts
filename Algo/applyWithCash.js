function applyCash(options){
  //options = {principal,percentage,buySellSignals,fee}
  options.percentage = options.percentage || 1;
  var netCash = options.principal;
  var per = options.percentage; //easier syntax
  var signals = options.buySellSignals; //easier syntax
  var length = options.buySellSignals.buy.length;
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
      signals.sell.forEach(function (sell){
        if( currentTime <= sell[0] && sell[0] <= nextBuyTime ){
          netCash += sell[1]*shares - fee;
          shares  -= shares;
          historicalValues.netCash.push([sell[0],netCash]);
          historicalValues.shares.push([sell[0],shares]);
          netValue = netCash + shares*sell;
          historicalValues.netCash.push([sell[0],netValue]);
        }
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
    historicalValues.netCash.unshift([currentTime,netCash]);
    historicalValues.netValue.unshift([currentTime,netValue]);
    historicalValues.shares.unshift([currentTime,shares]);
  }//end i - for loop;
  return historicalValues;
}//end applyCash function