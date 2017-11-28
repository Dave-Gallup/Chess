

class Player{

  constructor(color){
    this.name;
    this.wins = 0;

    color = color.toLowerCase();
    if(color === 'w' || color === 'white' || color === 'wht'){
      this.color = 'w';
    }
    else if(color === 'b' || color === 'black' || color === 'blk'){
      this.color = 'b';
    }
  }

  incrementWins(){
    this.wins++;
  }

  setName(name){
    name = name.trim();
    this.name = name[0].toUpperCase() + name.substring(1);
  }

  getName(){
    return this.name;
  }

  getWins(){
    return this.wins;
  }

  getColor(){
    return this.color;
  }

}


module.exports = {
  Player: Player
}
