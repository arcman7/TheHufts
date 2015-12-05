

#include <iostream>
#include <math.h>
#include <stdlib.h>
#include <fstream>
#include <cstdlib>
#include <vector>
#include <sstream>
#include <iomanip>
#include <map>
using namespace std;

// output data format: vector of maps
// include our jsonExport file '#include jsonExport.h'
// their algofile must create two vectors; buy&sell
// their algofile must call jsonExport on the two vectors
// their algofile must not have any other cout statements
   vector < map<string,double>> buy;
   vector < map<string,double>> sell;

   std::string results;

  void exportJSON( std::vector< map<string,double>>& buy, std::vector< map<string,double>>& sell/*, std::string& resuts*/){
     int lengthB = buy.size();
     int lengthS = sell.size();

     cout<<lengthB<<" "<<lengthS<<endl;
     std::string slash = "\\";
     std::string qoute = "\"";

    int i = 0;
     std::ostringstream index;
     cout<<"\"[";
     for(i=0; i<lengthB;i++){
      cout<<"[";
      for(std::map<string, double>::iterator iter = buy[i].begin(); iter != buy[i].end(); ++iter){
      string k =  iter->first;
      double v = iter->second;

      cout<<k<<","<<v;
      }
      if(i<=lengthB -2){
        cout<<"],";
      }
      else{
        cout<<"]";
      }
     }//end for loop-i


    cout<<"]\";\"[";
    for(int j=0; j<lengthS;j++){
     cout<<"[";
     for(std::map<string,double>::iterator iterS = sell[j].begin(); iterS != sell[j].end(); ++iterS){
      string k =  iterS->first;
      double v = iterS->second;

      cout<<k<<","<<v;
     }
     if(i<=lengthS -2){
        cout<<"],";
     }
     else{
        cout<<"]";
     }
    }//end for loop-j

  cout<<"]\""<<endl;
}//end exportJSON


int main() {

  int i = 0;
  std::ostringstream index;
   //cout<<"\"["<<endl;
   for(i=0; i<10; i++){
     string index = to_string(i);
    // std::string sindex = index.str();
     buy.push_back( map<string,double>() );

     buy[i][index] = i*2.0;
     //cout<<buy[i][index]<<","<<endl;
     //sell[i][sindex] = i*2.0;
     //buy[i].push_back(i*1.0); buy[i].push_back(i*2.0);
     //sell.push_back( vector<double>() );
     //sell[i].push_back(i*1.0); sell[i].push_back(i*2.0);
    };

  for(i=0; i<10; i++){
     string index = to_string(i);

     sell.push_back( map<string,double>() );

     sell[i][index] = i*2.0;

   }

  exportJSON(buy,sell);

  return 0;
}