#include <iostream>
#include <string>
#include <regex>
#include <cstdarg>


using namespace std;


// current unconsumed source code

string source;


void use(string input) {
  source = input;
}





string token(


void fail() {
  cout << "syntax error\n";
  throw;
}


string token(string re) { 
  int s;
  smatch sm;
  regex_search(input, sm, regex(re));

  if ((s = sm.size()) == 0) 
    fail();

  return sm[s - 1];
}


int main() {
  auto m = token("^(0x[0-9a-fA-F]+|0b[01]+|\\d+\\.\\d+|\\d+)");

  cout << m << endl;
}
