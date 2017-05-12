
var readline = require('readline-sync');

var Match = require('./match.js').Match;
var CLI = require('./cli.js').CLI;
var Player = require('./player.js').Player;

/*
 *  Things I am not implementing: en passant, castling, restricting the
 *  king from moving into a position of threat, pawn-promotion.
 *  Not forcing king to move when in check.
 */
class Game{
  constructor(){
    this.playerWhite = new Player('w');
    this.playerBlack = new Player('b');
    this.match;
  }

  play(){

    let cli = new CLI();
    let play = 'y';

    while(play === 'y'){

      if(this.playerWhite.getWins() + this.playerBlack.getWins() === 0){
        play = cli.prompt("Begin chess? [y/n] ", ['y','n']);
      }
      else{
        play = cli.prompt("Another game? [y/n] ", ['y','n']);
      }

      if(play === 'y'){
        this.match =  new Match(this.playerWhite, this.playerBlack);

        if(this.playerWhite.getName() === undefined){
          let nameWhite = cli.prompt("Enter White player's name: ");
          this.playerWhite.setName(nameWhite);
        }
        if(this.playerBlack.getName() === undefined){
          let nameBlack = cli.prompt("Enter Black player's name: ");
          this.playerBlack.setName(nameBlack);
        }
        let winner = this.match.playMatch();

        if(winner === this.playerWhite){
          this.playerWhite.incrementWins();
        }
        if(winner === this.playerBlack){
          this.playerBlack.incrementWins();
        }
      }
    }
    let totalPlayed = this.playerWhite.getWins() + this.playerBlack.getWins();
    console.log(`    Summary: ${totalPlayed} game${totalPlayed != 1?'s':''} played.`);
    if(totalPlayed > 0){
      console.log(`    ${this.playerWhite.getName()} (white) won ${this.playerWhite.getWins()} game${this.playerWhite.getWins() != 1?'s':''}, ${this.playerBlack.getName()} (black) won ${this.playerBlack.getWins()} game${this.playerBlack.getWins() != 1?'s':''}.`);
    }

  } //End play

} //END Game class


var game = new Game();
game.play();
