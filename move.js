


// Should have the piece, a from pos and a to pos
// also optionally passes a piece taken.
// This way, it should be easy to reverse moves if undo is invoked.
class Move{
  constructor(piece, fromPos, toPos, algebraicNotation, pieceTaken = undefined){

    this.piece = piece;
    this.fromPos = fromPos;
    this.toPos = toPos;
    this.algebraicNotation = algebraicNotation;
    this.pieceTaken = pieceTaken;
  }

  /*
   *  Parses out an algebraic notation move and return two to three possible
   *  pieces of data.  It will always return the target location of the move
   *  as well as the piece type.  It may - depending on the notation - also
   *  return a modifier which further denotes the location of the piece being
   *  moved.  This last piece of information is typically only supplied when
   *  there is ambiguity as to which piece might be legally moved to the target
   *  location (as in when both white knights can move to the same square).
   *
   *  moveResponse (string) - the move being requested by the player in the
   *              form of algebraic notation.  This could be between 3 and 5
   *              characters. (E.g.- 'pd3','qxf6', 'n5c3', 'raxa5')
   *
   *  returns object containing data-toggle
   *              {
   *                type: (string) single char representation of piece type,
   *                modifier: (string) single char for rank/file ('a' or '5')
   *                target: (string) algebraic loc or target (E.g.- 'e5')
   *              }
   */
  static parseMoveResponse(moveResponse){

    let output = {};

    //strip out any plus signs
    moveResponse = moveResponse.replace(/\+/g, '');

    let takesX = moveResponse.indexOf('x');

    output.type = moveResponse[0];

    // if string contains an 'x'
    if(takesX > -1){
      output.target = moveResponse.substring(takesX + 1);
      if(takesX > 1){
        output.modifier = moveResponse.substring(1,takesX);
      }
    }
    // string doesn't contain an 'x'
    else{
      output.target = moveResponse.slice(-2);
      if(moveResponse.length > 3){
        output.modifier = moveResponse[1];
      }
    }
    return output;
  }// end parseMoveResponse

} //END Move class













module.exports = {
  Move: Move
}
