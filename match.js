var Board = require("./board.js").Board;
var CLI = require("./cli.js").CLI;
var Move = require("./move.js").Move;

class Match{
  constructor(playerWhite, playerBlack){
    this.board = new Board();
    this.moveQueue = []; //A stack to hold moves so can be replayed or reversed.
    this.redoQueue = []; //A stack to hold reversed moves
    this.playerWhite = playerWhite;
    this.playerBlack = playerBlack;
    this.currentPlayer = playerWhite;
    this.flip = false; //initialize to false so white goes first
    this.gameover = false;
    this.validCommands = this.generateCommandsArray();
    this.moveCount = 1;
    this.printBoard = true;
  }//END constructor

  playMatch(){

    let cli = new CLI();

    while(!this.gameover){

      // allows errors to run loop again without changing players
      if(this.flip){
        this.flipPlayer();
      }

      if(this.printBoard){
        this.board.printBoard();
      }

      let promptStr = "";

      promptStr = `[${this.moveCount}] It is ${this.currentPlayer.getName()}'s move (${this.currentPlayer.getColor() === 'w'? 'white':'black'}) `;

      // prompt for move
      let moveResponse = cli.prompt(promptStr, this.validCommands);

      // handle move entry
      // help
      if(moveResponse === 'help'){
        console.log("no help available");//TODO
      }
      // resign
      if(moveResponse === 'resign'
        || moveResponse === '0-1'
        || moveResponse === '1-0'){
        console.log(`${this.currentPlayer.getName()} has resigned (${this.currentPlayer.getColor()}).`);
        this.gameover = true;
        this.flipPlayer();// so that opposing player is credited for win
      }
      // undo
      else if(moveResponse === 'undo'){
        console.log('Undo functionality not yet implemented.');//TODO
      }
      // redo
      else if(moveResponse === 'redo'){
        if(this.moveQueue.length === 0){
          console.log('Cannot redo.  You are at the most recent move.');//TODO
          continue;
        }
        //else pop from redoQueue and process back to moveQueue
      }
      // make a move
      else{

        this.flip = true;//ok to flip player once valid move has been entered
        let move = this.resolveMove(moveResponse);

        // if the supplied move is not valid or if it requires disambiuating,
        // restart the loop without changing player or pushing move.
        if(move === null){
          continue;
        }

        this.printBoard = true;
        this.pushMove(move);


      }
    } // END big while loop

    // match is over.  return winner.
    return this.currentPlayer;
  } //END playMatch


  /*
   * Takes an algebriac move string and resolves it to a Move obj.
   *
   *  algebraicMove (string) - e.g. nxd3
   *
   *  The function accepts the string formatted as an algebraic move
   *  and parses out the piece (e.g. - king, knight, pawn...) as well
   *  as the destination position (e.g. - c6).  It then determines
   *  player is moving so it can look for the appropriate-colored
   *  piece and determine which one (if there is more than one as
   *  is the case with any piece except king and queen) can feasibly
   *  get to that destination square.  If only one piece is possible,
   *  it creates the move object and returns it.  If no pieces are
   *  possible, it returns null.  If it is ambiguous (as might be the
   *  case when both white knights can move to the same square, for
   *  instance), then it will call the disambiguating script to ask
   *  the player which of the 2 pieces was intended.
   *
   *  returns the Piece object which will make the move.
   */
  resolveMove(algebraicMove){

    // get locations of all matching pieces (2d arr, e.g. - [[7,0],[7,7]])
    let positions = this.getPiecePositions(this.currentPlayer.getColor(), algebraicMove);

    let feasibleMoves = [];
    let parsedMove = Move.parseMoveResponse(algebraicMove);

    if(positions.length === 0){//no matching pieces are on the board
      return null;
    }

    // figure out which of these pieces can feasibly move to destination loc
    // go through positions of matching pieces and return all feasible Moves
    for(let i = 0; i < positions.length; i++){
      feasibleMoves.push(
        this.determineFeasibility(
          this.board.getPieceAt(positions[i])
          , positions[i]
          , parsedMove.target
        )
      );
    }

    //filter out nulls
    feasibleMoves = feasibleMoves.filter(el=>el !== null);

    // if there are no feasible moves to be made from the pieces given,
    // return null
    if(feasibleMoves.length === 0){
      console.log('The specified move cannot be made.');
      this.flip = false;
      this.printBoard = false;
      return null;
    }

    //if multiple pieces are feasible, disambiguate
    if(feasibleMoves.length > 1){

      console.log(`There are multiple pieces which may be moved to the selected destination square.`);
      console.log(`Please use more precise notation.`);
      this.flip = false;
      this.printBoard = false;

      return null;
    }
    
    // only one possible piece can perform the move legally
    else{

      let move = this.makeMove(feasibleMoves[0], algebraicMove);
      return move;
    }
  } // END resolveMove

  /*
   *  Builds the Move object to be executed and pushed to the moveQueue.
   *
   *  piece (Piece) - the piece to be moved
   *  moveResponse (string) - the command in algebraic notation entered by the
   *                player.  This is parsed to provide details to the Move obj.
   *
   *  returns a Move obj.
   */
  makeMove(piece, moveResponse){

    let parsedMove = Move.parseMoveResponse(moveResponse);
    let fromPos = this.board.getPiecePosition(piece)
    //remove piece from curr location
    this.board.removePieceAt(fromPos);
    //remove taken piece if nbecessary
    let takenPiece = this.board.getPieceAt(parsedMove.target);
    if(takenPiece !== undefined){
      this.board.takePiece(takenPiece, parsedMove.target);
    }

    //place piece in new location
    this.board.placePieceAt(piece, parsedMove.target);

    //create Move obj and return it
    let move = new Move(piece, fromPos, parsedMove.target, moveResponse, takenPiece);
    return move;
  }


  /*
   *  Accepts a Piece object and
   *  determines if that piece is allowed to move from its current
   *  location to the specified target locaction.
   *
   *  piece (Piece) - the piece to be considered
   *  fromPos (string) - origin location in algebraic notation(e.g. 'c5')
   *  toPos (string) - destination location in algebraic notation.
   *
   *  Given a piece's ability to move, this function will check to see
   *  if the piece is allowed to move that way, if there is a clear path
   *  to the destintion, if there is another piece of the same color
   *  already occupying that space.
   *
   *  returns the piece if it is feasible, null otherwise
   */
  determineFeasibility(piece, fromPos, toPos){

    //if the piece is not on the fromPos, return null immediately
    if(this.board.getPieceAt(fromPos) !== piece){
      return null;
    }

    // check with the piece and the board's current configuration to see
    // if the piece is capable of moving from its current location to the
    // target location.
    if(piece.canMove(fromPos, toPos, this.board)){
      return piece;
    }
    return null;
  }

  /*
   *  This function accepts a piece and a color and finds all positions
   *  on the board (if any) where those pieces are currently set.
   *
   *  piecePrefix (string) - color & piece without designation (ex. 'br')
   *
   *  This returns the location(s) of the piece(s) on the board in
   *  array index form in a 2d array (e.g. - [[4,3]] or [[7,0],[7,7]]).
   *  Returns an empty array if no valid pieces exist on the board.
   */
  getPiecePositions(color, algebraicMove){

    let resultsArr = [];

    for(let r = 0; r < this.board.board.length; r++){
      for(let c = 0; c < this.board.board[r].length; c++){
        let piece = this.board.getPieceAt(r,c);
        if(piece !== undefined && piece.getColor() === color && piece.getType() === algebraicMove[0]){
          resultsArr.push(this.board.indecesToAlgebraic(r,c));
        }
      }
    }
    return resultsArr;
  } // END getPiecePositions

  /*
   *  Push the supplied move to the moveQueue. In the process, it also checks
   *  to see if the gameover value should be set to true and sets the moved
   *  piece to 'moved' in the Piece object.
   */
  pushMove(move){

    this.moveQueue.push(move);
    this.checkIfGameover(move);
    move.piece.setHasMoved();
    this.moveCount++;
  }

  checkIfGameover(move){
    if(move.pieceTaken !== undefined
        && move.pieceTaken.getType() === 'k'){
      console.log('Game over.');
      this.gameover = true;
    }
  }

  undoMove(){

    let move = this.moveQueue.pop();
    this.redoQueue.push(move);
    this.moveCount--;
    return move;
  }

  /*
   *  Flips the current player.
   */
  flipPlayer(){
    if(this.currentPlayer === this.playerWhite){
      this.currentPlayer = this.playerBlack;
    }
    else if(this.currentPlayer === this.playerBlack){
      this.currentPlayer = this.playerWhite;
    }
  }

  /*
   *  This generates all valid commands a player can enter once the match
   *  has begun.  These include all algebraic notaion moves as well as
   *  specialty moves like "resign" and "undo".
   *
   *  Returns an array of all commands in string format.
   */
  generateCommandsArray(){

    //0-0 or O-O === castle kingside
    //0-0-0 or O-O-O === castle kingside
    let validCommands = ['resign','help','undo','redo','0-0', '0-0-0','O-O','O-O-O','1-0','0-1'];

    let pieces = 'kqrbnp';
    let cols = 'abcdefgh';
    let disambigChars = cols + '12345678';

    // generate disambiguating moves (e.g. - 'n3c4','rdxd5')
    for(let i = 0; i < pieces.length; i++){
      for(let x = 0; x < disambigChars.length; x++){
        for(let j = 0; j < cols.length; j++){
          for(let k = 1; k < 9; k++){
            this.pushUnique(validCommands, pieces[i] + cols[j] + k)
            this.pushUnique(validCommands, pieces[i]+ 'x' + cols[j]+k)
            this.pushUnique(validCommands, pieces[i] + disambigChars[x] + cols[j] + k)
            this.pushUnique(validCommands, pieces[i] + disambigChars[x] + 'x' + cols[j]+k)
          }
        }
      }
    }
    return validCommands.sort();
  }

  /*
   *  Only pushes values to the collection which do not already exist in coll.
   */
  pushUnique(coll, el){
    if(!coll.includes(el)){
      coll.push(el);
    }
  }

} //END Match class

module.exports = {
  Match: Match
}
