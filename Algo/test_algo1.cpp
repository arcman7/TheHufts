struct data{
  string time;
  double price;
};

vector<vector<data>> algo_test(vector<data>& data_set){
    vector<vector<data>> signals;
    vector<data> buy; vector<data> sell;
    int end = data_set.size() - 1;//something weird was happening when using data_set.size() -1 in if()
    for(int i=0; i<data_set.size(); i++){

      if( (i < end ) && (data_set[i].price < data_set[i+1].price) ){
        buy.push_back(data_set[i]);
        sell.push_back(data_set[i+1]);
      }

    }

    signals.push_back(buy);
    signals.push_back(sell);
    return signals;
}

//helper functions used for entropy_algo:
vector<data> slide_time_window( int& index, vector<data>& data_set, vector<data>& window)
{
  vector<data> new_window;
  for(int i=1; i< window.size(); i++){
    new_window.push_back(window[i]);
  }
  index += 1;
  new_window.push_back(data_set[index]);
  return new_window;
}

void initalize_window(int size, vector<data>& window, vector<data>& data_set){
  for(int i = 0; i < size; i++){
    window.push_back(data_set[i]);
  }
}

double average(vector<data>& window){
  double sum = 0;
  double total = window.size()*1.0;
  for(int i=0; i < window.size(); i++){
    sum += window[i].price;
  }
  sum = sum/total;
  return sum;
}

//shanon's entropy of information (applied in a binary system)
double entropy(vector<data>& window, int& pCount, int& nCount){
  //int pCount, nCount;
  double pU,pN;
  pCount = nCount = 0;
  double entropy;
  for(int i = 0; i < window.size()-1; i++){
    if(window[i].price < window[i+1].price){
      pCount += 1;
    }
    if(window[i].price > window[i+1].price){
      nCount += 1;
    }
    pU = pCount*1.0 / window.size()*1.0;
    pN = nCount*1.0 / window.size()*1.0;
  }
  entropy = -1*pU*log(pU) + -1*pN*log(pN);
  return entropy;
}

double mapped_entropy(double& entropy){
  double entropy_max = 0.301029995664;
  return (1-pow(entropy/entropy_max,2) );
}
//helper function END

vector<vector<data>> entropy_algo(vector<data>& data_set){
    vector<vector<data>> signals;
    vector<data> buy; vector<data> sell;
    vector<data> window;
    int index = 0;
    int pCount, nCount;
    double ent,mapped_ent;
    initalize_window(14, window, data_set);

    while( index < data_set.size() ){
      ent = entropy(window, pCount, nCount);
      mapped_ent = mapped_entropy(ent);
      //0.7 is an arbitrary constant, and in general will be a paramter to be varierd and optimized
      //mapped_entropy uses powers of 2 (symetric with undervalued and overvalued stock state), and thus we must make sure nCount > pCount is true
      if( mapped_ent > 0.7 && nCount > pCount){
        buy.push_back(data_set[index]);
      }
      int last_index = sell.size() -1;
      if(last_index > -1){
        if( data_set[index].price > buy[last_index].price){
          sell.push_back(data_set[index]);
        }
      }

      slide_time_window(index, data_set, window);
    }

    signals.push_back(buy);
    signals.push_back(sell);
    return signals;
}
