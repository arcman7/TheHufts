function ent(data_set,options){
  var buy     = [];
  var sell    = [];
  var signals = {};
  var window;
  var index = 0;
  var pCount, nCount;
  var entr,mapped_ent;

  //helper functions
  function slide_time_window(data_set,window){
    var new_window = [];
    for(var i=1; i< window.length; i++){
      new_window.push(window[i]);
    }
    index += 1; //index is a global variable
    new_window.push(data_set[index]);
    return new_window;
  }

  function initalize_window(size, data_set){
    var window = [];
    for(var i = 0; i < size; i++){
      window.push(data_set[i]);
    }
    //console.log(window);
    return window;
  }

  function entropy(window){
    //var pCount, nCount;
    var pU,pN;
    pCount = nCount = 0; //uses global variables pCount & nCount
    var entropy,total;
    for(var i = 0; i < window.length-1; i++){
      if(window[i][1] < window[i+1][1]){
        pCount += 1;
      }
      if(window[i][1] > window[i+1][1]){
        nCount += 1;
      }

    }
    total = pCount + nCount;
    pU = pCount*1.0 / total*1.0;//window.length*1.0;
    pN = nCount*1.0 / total*1.0;//window.length*1.0;
    entropy = -1*pU*Math.log(pU) -1*pN*Math.log(pN);
    return entropy;
  }

  function mapped_entropy(entropy){
    var entropy_max = Math.log(0.5);//base e --> 0.301029995664;
    //console.log(entropy);
    return (1-Math.pow(entropy/entropy_max,2) );
  }
 //helper functions END

  window = initalize_window(16, data_set);
  var selltracker = false;
  while( index < data_set.length ){
      entr = entropy(window);
      mapped_ent = mapped_entropy(entr);

      //console.log(mapped_ent);
      //0.7 is an arbitrary constant, and in general will be a parameter to be varied and optimized
      //mapped_entropy uses powers of 2 (symetric with undervalued and overvalued stock state), and thus we must make sure nCount > pCount is true
      if( mapped_ent > 0.6 && nCount > pCount){
        buy.push(data_set[index]);
        selltracker = true;
        //console.log(selltracker);
      }
      var last_index = buy.length -1;
      if(last_index > -1){ //checking if there any buy signals to make sell signals from
        //console.log(data_set[index][1] > buy[last_index][1], selltracker);
        if( data_set[index][1] > buy[last_index][1] && selltracker){
          sell.push(data_set[index]);
          selltracker = false;
        }
      }

      window = slide_time_window(data_set, window);
  }//end while

  signals["buy"]  = buy;
  signals["sell"] = sell;
  //console.log(signals)
  return signals;
 }


