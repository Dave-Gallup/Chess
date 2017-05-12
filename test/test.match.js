var expect = require('chai').expect;
var Match = require('../match.js').Match;
var Player = require('../player.js').Player;
var Piece = require('../piece.js').Piece;

describe('Match', function(){

  var match;
  var bn1;

  before(function(){
    let white = new Player('white');
    white.setName('Blanca');
    let black = new Player('black');
    black.setName('Schwartz');

    match = new Match(white, black);

    bn1 = match.board.getPieceAt('b8');
    bp3 = match.board.getPieceAt('c7');
    bp5 = match.board.getPieceAt('e7');
    bk1 = match.board.getPieceAt('e8');

  });

  it('getPiecePositions - white pawns', function(){
  expect(match.getPiecePositions('w','pxd3')).to.deep.equal(
    ['a2','b2','c2','d2','e2','f2','g2','h2']);
  });

  it('getPiecePositions - black knights', function(){
    expect(match.getPiecePositions('b','nxf6')).to.deep.equal(['b8', 'g8'])
  });

  it('should determine the feasibility of a piece moving from a given position to a given position', function(){
    expect(match.determineFeasibility(bk1, 'e8', 'e7')).to.equal(bk1);
  });

});
