var expect = require('chai').expect;
var Board = require('../board.js').Board;
var Piece = require('../piece.js').Piece;

describe('Board', function(){

  var board;

  before(function(){
    board = new Board();
  });

  it('(algerbraicToIndeces) should convert algebraic notation (e.g. \'nf3\' to array indeces)', function(){
    expect(board.algerbraicToIndeces('a8')).to.deep.equal([0,0]);
    expect(board.algerbraicToIndeces('a1')).to.deep.equal([7,0]);
    expect(board.algerbraicToIndeces('h8')).to.deep.equal([0,7]);
    expect(board.algerbraicToIndeces('h1')).to.deep.equal([7,7]);
    expect(board.algerbraicToIndeces('d4')).to.deep.equal([4,3]);
  });


  it('(indecesToAlgebraic) should convert array indeces (e.g.- 2,1) to algebraic notation', function(){
    expect(board.indecesToAlgebraic(0,0)).to.equal('a8');
    expect(board.indecesToAlgebraic(7,0)).to.equal('a1');
    expect(board.indecesToAlgebraic(0,7)).to.equal('h8');
    expect(board.indecesToAlgebraic(7,7)).to.equal('h1');
    expect(board.indecesToAlgebraic(4,3)).to.equal('d4');
    expect(board.indecesToAlgebraic([4,3])).to.equal('d4');


  });

  it('(validPos) should be true if supplied indeces are on the board, false otherwise.', function(){
    expect(board.validPos(0,0)).to.be.true;
    expect(board.validPos(0,7)).to.be.true;
    expect(board.validPos(7,0)).to.be.true;
    expect(board.validPos(7,7)).to.be.true;
    expect(board.validPos(0,8)).to.be.false;
    expect(board.validPos(8,7)).to.be.false;
    expect(board.validPos(-1,5)).to.be.false;
  });

  it('(parseSquare) expects algebraic coordinates top be pulled from move string', function(){
    expect(board.parseSquare('pxd3')).to.be.equal('d3');
    expect(board.parseSquare('pd3')).to.be.equal('d3');
    expect(board.parseSquare('pdxd3')).to.be.equal('d3');
  });

  it('(getPieceAt) should return a Piece object at the location provided and handle both algebraic notation as well as index coordinates.', function(){
    expect(board.getPieceAt(0,0)).to.deep.equal(new Piece('b', 'r', 1));
    expect(board.getPieceAt(7,7)).to.deep.equal(new Piece('w', 'r', 2));
    expect(board.getPieceAt('d8')).to.deep.equal(new Piece('b', 'q', 1));
    expect(board.getPieceAt('d4')).to.equal(undefined);
  });

});
