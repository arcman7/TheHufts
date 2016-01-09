function ent(array,options=undefined){
  var buy     = [];
  var sell    = [];
  var signals = {};
  var window;
  var index = 0;
  var pCount, nCount;
  var entr,mapped_ent;

  //helper functions
  function slide_time_window(data_set,window){
    var window = [];
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
      window.push_back(data_set[i]);
    }
    return window;
  }

  function entropy(window){
    //var pCount, nCount;
    var pU,pN;
    pCount = nCount = 0; //uses global variables pCount & nCount
    var entropy;
    for(var i = 0; i < window.length-1; i++){
      if(window[i].price < window[i+1].price){
        pCount += 1;
      }
      if(window[i].price > window[i+1].price){
        nCount += 1;
      }
      pU = pCount*1.0 / window.length*1.0;
      pN = nCount*1.0 / window.length*1.0;
    }
    entropy = -1*pU*Math.log(pU) -1*pN*Math.log(pN);
    return entropy;
  }

  function mapped_entropy(double& entropy){
    double entropy_max = 0.301029995664;
    return (1-Math.pow(entropy/entropy_max,2) );
  }
 //helper functions END

  window = initalize_window(14, data_set);

  while( index < data_set.length ){
      entr = entropy(window);
      mapped_ent = mapped_entropy(entr);
      //0.7 is an arbitrary constant, and in general will be a parameter to be varied and optimized
      //mapped_entropy uses powers of 2 (symetric with undervalued and overvalued stock state), and thus we must make sure nCount > pCount is true
      if( mapped_ent > 0.7 && nCount > pCount){
        buy.push(data_set[index]);
      }
      var last_index = sell.length -1;
      if(last_index > -1){
        if( data_set[index].price > buy[last_index].price){
          sell.push(data_set[index]);
        }
      }

      window = slide_time_window(array, window);
  }//end while

  signals["buy"]  = buy;
  signals["sell"] = sell;
  return signals;
 }


