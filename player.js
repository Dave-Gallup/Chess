

class Player{

  constructor(color){
    this.name;
    this.color = color;
    this.wins = 0;
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
