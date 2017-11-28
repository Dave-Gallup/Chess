var Piece = require('./piece.js').Piece;

class Rook extends Piece{

  constructor(color, designation){
    super(color, 'r', designation);
  }

  /*
   *  Determines the viable moves for a rook based on its starting position.
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
    var moveArr = [];

    //add possible positions
    //all positions up
    for(let i = 1; i <= 7; i++){
      moveArr.push([fromRow - i, fromCol]); //All positions N
      moveArr.push([fromRow, fromCol + i]); //All positions E
      moveArr.push([fromRow + i, fromCol]); //All positions S
      moveArr.push([fromRow, fromCol - i]); //All positions W
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

    let test = this.includesArray(moveArr, toPos, board);
    return this.includesArray(moveArr, toPos, board);
  }

}// END class

module.exports = {
  Rook: Rook
}
