
class Piece{

  /*
   *  type (string): type of piece (ex. 'k','n','b','q','r','p')
   *  color (string): 'b' or 'w'
   *  designation (number): 1-8 designates which it is when there are multiple
   *    (ex: '2' if the piece is the second white knight, '7' if 7th black pawn)
   */
  constructor(color, type, designation){
    this.color = color;
    this.type = type;
    this.designation = designation;
    this.hasMoved = false;
  }

  getType(){
    return this.type;
  }

  getColor(){
    return this.color;
  }

  getDesignation(){
    return this.designation;
  }

  setHasMoved(){
    this.hasMoved = true;
  }

  /*
   *  Determines if a position array is present in an array of pos arrays.
   *
   *  collArr (2d Array) - Array of smaller arrays. The collection.
   *  arrToCheck (array) - Array containing row and col (e.g. - [3,4])
   *  board (Board obj) - the board (only present to use translate function)
   *
   *  returns true if the pos array is present in the collection and false
   *  otherwise.
   */
  includesArray(collArr, arrToCheck, board){

    for(let arr of collArr){
      if(typeof arr !== 'string'){
        arr = board.indecesToAlgebraic(arr);
      }
      if(arr === arrToCheck){
        return true;
      }

    }
    return false;
  }

  /*
   *  This takes an algebraic position on the board and determines if
   *  there is a piece currently occupying that square.
   *
   *  position (string) - positon on board in algebraic notation (e.g. 'd3')
   *  index (number) - this isn't used, but present to allow the filter function
   *                  to work.
   *  array (array) - this isn't used, but present to allow the filter function
   *                  to work.
   *  board (Board obj) -  the board currently being played
   *
   *  returns true is there is no piece occupying the square or if the piece
   *  in that square is the opposing color.
   */
   //NOTE: this does not work when passed as HO function to filter in other
   //      children of Piece class.  So it is not currently being used.
  verifySquareIsOpen(position, board){

    let piece = board.getPieceAt(position[0],position[1]);

    //if there is a piece present AND that piece is NOT an opposing color
    if(piece !== undefined && piece.getColor() === this.getColor() ){
      return false;
    }
    // otherwise, if there is not a piece there OR the piece is opposing color
    return true;
  }

} // END class





module.exports = {
  Piece: Piece
}
