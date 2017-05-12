var Piece = require('./piece.js').Piece;

class Pawn extends Piece{

  constructor(color, designation){
    super(color, 'p', designation);
  }

  /*
   *  Determines the viable moves for a pawn based on its starting position.
   *  Note: this function does NOT check to see if another piece occupies the
   *  toPos position on the curtrent board.
   *
   *  fromPos (string) - algebraic position from where the piece is starting
   *  toPos (string) - algebraic position where the piece is targeting.
   *
   *  returns true if possible for this piece to move to the toPos from the
   *  fromPos and returns false otherwise.
   */
  canMove(fromPos, toPos, board){

    var fromRow, fromCol;
    [fromRow, fromCol] = board.algerbraicToIndeces(fromPos);

    // check to see if there is another piece at the target location and, if
    // there is, determine if it is opposing.
    let pieceAtToPos = board.getPieceAt(toPos);
    let taking = false;

    var moveArr = [];

    //determine if the move is meant to take an opposing piece based on the
    //contents of the destination square
    if(pieceAtToPos !== undefined
        && pieceAtToPos.getColor() !== this.getColor()){
      taking = true;
    }

    if(taking){
      if(this.getColor() === 'w'){
        moveArr.push([fromRow-1, fromCol-1]);//take left
        moveArr.push([fromRow-1, fromCol+1]);//take right
      }
      else if(this.getColor() === 'b'){
        moveArr.push([fromRow+1, fromCol-1]);//take left
        moveArr.push([fromRow+1, fromCol+1]);//take right
      }
    }
    // if not taking
    else{

      //add possible positions to Move Array
      //white pawns can only move north
      if(this.getColor() === 'w'){
        moveArr.push([fromRow - 1, fromCol]); // move forward one square
        if(!this.hasMoved){
          moveArr.push([fromRow - 2, fromCol]); // move fwd 2 squares from home
        }
      }
      //black pawns can only move south
      else if(this.getColor() === 'b'){
        moveArr.push([fromRow + 1, fromCol]); // move forward one square
        if(!this.hasMoved){
          moveArr.push([fromRow + 2, fromCol]); // move fwd 2 squares from home
        }
      }
    }


    // filter out positions that are outside of the board's constraints
    moveArr = moveArr.filter(el => board.validPos(el[0], el[1]));

    // filter out moves whose paths are not clear
    moveArr = moveArr.filter(el => board.isClearPath(fromPos, board.indecesToAlgebraic(el[0],el[1])));

    //TODO refactor below out of each Piece child
    // verify that no pieces of the same color are occupying that space
    moveArr = moveArr.filter(el => {
      let piece = board.getPieceAt(el[0],el[1]);

      //if there is a piece present AND that piece is NOT an opposing color
      if(piece !== undefined && piece.getColor() === this.getColor() ){
        return false;
      }
      // otherwise, if there is not a piece there OR the piece is opposing color
      return true;
    });

    moveArr = moveArr.map(board.indecesToAlgebraic);

    return this.includesArray(moveArr, toPos, board);

  }


}// END class

module.exports = {
  Pawn: Pawn
}
