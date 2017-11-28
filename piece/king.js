var Piece = require('./piece.js').Piece;

class King extends Piece{

  constructor(color, designation){
    super(color, 'k', designation);
  }

  /*
   *  Determines the viable moves for a king based on its starting position.
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
    moveArr.push([fromRow - 1, fromCol ]); // up
    moveArr.push([fromRow - 1, fromCol + 1]); // up  right
    moveArr.push([fromRow, fromCol + 1]); // right
    moveArr.push([fromRow + 1, fromCol + 1]); // down right
    moveArr.push([fromRow + 1, fromCol ]); // down
    moveArr.push([fromRow + 1, fromCol - 1]); // down  left
    moveArr.push([fromRow, fromCol -1]); // left
    moveArr.push([fromRow - 1, fromCol - 1]); // up left

    // filter out positions that are outside of the board's constraints
    moveArr = moveArr.filter(el => board.validPos(el[0], el[1]));

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


    return this.includesArray(moveArr, toPos, board);

  }

}// END class

module.exports = {
  King: King
}
