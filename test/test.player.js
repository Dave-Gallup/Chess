var expect = require('chai').expect;
var Player = require('../player.js').Player;

describe('Player', function(){

  var player;

  before(function(){
    player = new Player('black');
  });

  it('should have a name', function(){
    player.setName('Bob');
    expect(player.getName()).to.equal('Bob');
  });

  it('should return player\'s color', function(){
    expect(player.getColor()).to.equal('b');
  });

  it('should return correct number of wins', function(){
    expect(player.getWins()).to.equal(0);
    player.incrementWins();
    player.incrementWins();
    expect(player.getWins()).to.equal(2);
  });

});
