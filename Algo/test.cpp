#include <iostream>
#include <math.h>
#include <stdlib.h>
#include <fstream>
#include <cstdlib>
#include <vector>
#include <sstream>
#include <iomanip>
using namespace std;

int main(){
  string test;
  //cin >> test;
  cout <<"from c++ file"<<endl;// test <<endl;
  ofstream fout("/Users/Jedi_scholar/Desktop/phase-4/hiring_mixers/TheHufts/Algo/results.txt");
  fout << "testing 12345678"<<endl;
  fout.close();
}