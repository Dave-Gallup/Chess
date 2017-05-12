var readline = require('readline-sync');


class CLI{

  prompt(question, responses){
    question += '> ';
    let response = readline.question(question)
                           .trim()
                           .toLowerCase();

    if(responses !== undefined){
      while(!responses.includes(response)){

        response = readline.question("Invalid.  Please retry. > ")
                           .trim()
                           .toLowerCase();
      }
    }
    return response;
  }//END prompt

}// END CLI class









 module.exports = {
   CLI:CLI
 }
