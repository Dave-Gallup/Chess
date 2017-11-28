var Piece = require('./piece/piece.js').Piece;
var King = require('./piece/king.js').King;
var Queen = require('./piece/queen.js').Queen;
var Pawn = require('./piece/pawn.js').Pawn;
var Knight = require('./piece/knight.js').Knight;
var Rook = require('./piece/rook.js').Rook;
var Bishop = require('./piece/bishop.js').Bishop;

/*
 *
 */
class Board {
  constructor(){
    this.boardSize = 8;
    this.cellWidth = 4;
    this.board = this.initializeBoard();
    this.map = this.initializeBoardMap();
    this.takenPiecesWhite = [];//Array of Piece objects
    this.takenPiecesBlack = [];//Array of Piece objects
    this.alphaCols = 'abcdefgh';

    // obj mapping of all unicode chars used in drawing the gameboard
    this.chars = {
      whiteKing:  '\u2654', whiteQueen: '\u2655', whiteBishop:  '\u2657',
      whiteKnight:'\u2658', whiteRook:  '\u2656', whitePawn:    '\u2659',
      blackKing:  '\u265A', blackQueen: '\u265B', blackBishop:  '\u265D',
      blackKnight:'\u265E', blackRook:  '\u265C', blackPawn:    '\u265F',
      upperLeft:  '\u250F', upperDiv:   '\u2533', upperRight:   '\u2513',
      leftDiv:    '\u2523', centerDiv:  '\u254B', rightDiv:     '\u252B',
      lowerLeft:  '\u2517', lowerDiv:   '\u253B', lowerRight:   '\u251B',
      horizontal: '\u2501', vertical:   '\u2503'
    };
  }

  /*
   *  Builds a 2d 8x8 array and then populates it with all 32 chess pieces
   *  in their starting positions.
   *
   *  returns a 2d array partially full of Piece objects.
   */
  initializeBoard(){
    let alphaCols = 'abcdefgh';
    let boardArr = this.initialize2dArray(8);
    //initialize white ranking pieces
    this.placePieceAt(new Rook('w',1), 'a1', boardArr);
    this.placePieceAt(new Knight('w',1), 'b1', boardArr);
    this.placePieceAt(new Bishop('w',1), 'c1', boardArr);
    this.placePieceAt(new Queen('w',1), 'd1', boardArr);
    this.placePieceAt(new King('w',1), 'e1', boardArr);
    this.placePieceAt(new Bishop('w',2), 'f1', boardArr);
    this.placePieceAt(new Knight('w',2), 'g1', boardArr);
    this.placePieceAt(new Rook('w',2), 'h1', boardArr);

    //initialize white pawns
    for(let i = 0; i < this.boardSize; i++){
      let pawn = new Pawn('w',(i+1));
      let loc = alphaCols[i] + '2';
      this.placePieceAt(pawn, loc, boardArr);
    }
    //initialize black pawns
    for(let j = 0; j < this.boardSize; j++){
      let pawn = new Pawn('b',(j+1));
      let loc = alphaCols[j] + '7';
      this.placePieceAt(pawn, loc, boardArr);
    }
    //initialize black ranking pieces
    this.placePieceAt(new Rook('b',1), 'a8', boardArr);
    this.placePieceAt(new Knight('b',1), 'b8', boardArr);
    this.placePieceAt(new Bishop('b',1), 'c8', boardArr);
    this.placePieceAt(new Queen('b',1), 'd8', boardArr);
    this.placePieceAt(new King('b',1), 'e8', boardArr);
    this.placePieceAt(new Bishop('b',2), 'f8', boardArr);
    this.placePieceAt(new Knight('b',2), 'g8', boardArr);
    this.placePieceAt(new Rook('b',2), 'h8', boardArr);

    return boardArr;
  }

  /*
   *  Initializes the 2D gameboard array.
   *
   *  numCols (number): indicates how many columns the 2D array will have.
   *
   *  Takes a number as input and initializes a 2-dimensional array to act
   *  as the game board to track piece locations.  This creates an empty
   *  array and pushes into it a number of inner arrays equal to the number
   *  passed in.
   */
  initialize2dArray(numCols){
    let arr = [];
    for(let i = 0; i < numCols; i++){
      arr.push(new Array(8));
    }
    return arr;
  }

  /*
   *  Places a given piece on the board at the given location.
   *
   *  piece (Piece) - the piece object to be placed
   *  location (string) - the algebraic location where piece will be placed.
   *  board (Board) - optional board on which piece is placed
   */
   placePieceAt(piece, location, board){

     if(board === undefined){
       board = this.board;
     }
     let coordinates = this.algerbraicToIndeces(location);

     board[coordinates[0]][coordinates[1]] = piece;
   }

   /*
    * Removes any piece from the supplied position on the current board.
    * Does not verify that a piece is there to begin with.
    *
    * row (number|string|array) - if a number is supplied in this arg, then
    *               it is the row value.  If a string is supplied, then it is
    *               the algebraic-style coordinates (e.g.- 'd3'). If an array
    *               is supplied, it is the numeric coordinates all together
    * col (number) - this is only required if the first arg (row) is a number.
    *               Then, this value is the column value corresponding to the
    *               row value.
    */
   removePieceAt(row, col){
     //if arg0 is a string, then parse algebraic to indeces
     if(typeof row === 'string'){
       [row,col] = this.algerbraicToIndeces(row);
     }
     // else if it is not a string or number, then it is an array of nums
     else if(typeof row !== 'number'){
       [row,col] = row;
     }

     this.board[row][col] = undefined;
   }

   /*
    * return the Piece object located at the supplied indeces or algebraic
    * location of the gameboard.
    *
    * row (number|string)  - first index of the 2d array OR the alegraic
    *                 location
    * col (number)  - second index of the 2d array OR undefined if the
    *                 algebraic location was supplied as the first arg.
    *
    * returns Piece object. returns undefined if none exists at that location.
    */
   getPieceAt(row, col){
     if(typeof row === 'string'){
       [row,col] = this.algerbraicToIndeces(row);
     }
     return this.board[row][col];
   }

   /*
    * Translates algebraic notation to 2d array indeces.
    * algebraicLocation (string) - alphanumeric coordinates on chess board
    *
    * For example, if the agebraic coordinates 'a8' were submitted, the
    * function should return the array loaction [0,0].  Similarly, 'h5'
    * will return [3,7].
    */
   algerbraicToIndeces(algebraicLocation){
     let alphaCols = 'abcdefgh';
     let letter = algebraicLocation.substring(0,1);
     let number = algebraicLocation.substring(1,2);

     let row = this.boardSize - parseInt(number);
     let col = alphaCols.indexOf(letter.toLowerCase());

     return [row,col];
   }

   /*
    * Takes a move in algebraic notation and picks out just the portion that
    * represents the piece's destination square.
    *
    * algebraicMove (string) - the full agebraic move such as 'pc3',
    * 'bxe4' or 'raxa5'
    *
    */
   parseSquare(algebraicMove){
     return algebraicMove.slice(-2);
   }

   /*
    * Takes array indeces and returns string denoting the equivalent algebraic
    * notation location.
    *
    * posRow (number): row value for 2d array OR an array of 2 numbers
    * posCol (number): column value for 2d array OR undefined if posRow was
    *                   an array of numbers containing both the row and col.
    *
    * Translates indeces such as 4,0 into the alphanumeric algebraic notation
    * coordinates such as 'a4';
    */
   indecesToAlgebraic(posRow, posCol){
     let alphaCols = 'abcdefgh';

     if(typeof posRow !== 'number'){//} && posCol === undefined){
       [posRow,posCol] = posRow;
     }
     let row = 8 - posRow; //TODO fix this weakness
    //  if(this.boardSize !== undefined){
    //   let row = this.boardSize - posRow;
    // }


     let col = alphaCols[posCol];

     return col + row;
   }

   /*
    * determines if supplied coordinates are within bounds of array
    *
    * row (number) - first index of 2d array
    * col (number) - second index of the 2d array
    *
    * returns true if valid, false otherwise*
    */
   validPos(row, col){
     return !(row < 0
        || row > this.board.length - 1
        || col < 0
        || col > this.board.length - 1);
   }

   getPiecePosition(piece){

     for(let r = 0; r < this.boardSize; r++){
       for(let c = 0; c < this.boardSize; c++){
         if(this.board[r][c] !== undefined
           && this.board[r][c] === piece){
           return this.indecesToAlgebraic(r,c);
         }
       }
     }
     return null;
   }

   /*
    * determines if the path is clear of pieces from a source position to a
    * destination position.  This is NOT inclusive of the source or
    * destination coordinates; it just checks the spaces in between.
    *
    * fromPos (string) - starting algebraic position (e.g. - 'b6')
    * toPos (string) - destination algebraic position
    *
    * return true is it is clear, false if not
    */
   isClearPath(fromPos, toPos){

    let fromRow, fromCol, toRow, toCol;

    //translate both locations to indeces
    [fromRow, fromCol] = this.algerbraicToIndeces(fromPos);
    [toRow, toCol] = this.algerbraicToIndeces(toPos);

    //find the difference direction between the from and to positions
    // each 'Diff' will only be either 1,0 or -1
    let rowDiff = (toRow-fromRow) !== 0 ? Math.abs(toRow-fromRow)/(toRow-fromRow) : 0;
    let colDiff = (toCol-fromCol) !== 0 ? Math.abs(toCol-fromCol)/(toCol-fromCol) : 0;

    //check each square in between fromPos and toPos for any piece
    while(toRow !== fromRow + rowDiff || toCol !== fromCol + colDiff){

      fromRow += rowDiff;
      fromCol += colDiff;
      // if a space in between fromPos and toPos is occupied by anything, false
      if(this.getPieceAt(fromRow, fromCol) !== undefined){
        return false;
      }
    }
    //otherwise, no space in between fromPos and toPos is occupied, then true
    return true;
   }

   /*
    *   Removes a given piece from the board and places it in the appropriate
    *   side's taken list.
    *
    *   pieceToTake (Piece) - piece being taken off the board
    *   row (number|string|array) - If number, this is the row value.  If a
    *                 string is passed, treated as the algebraic location
    *                 (E.g. - 'd3'). If array, then row and col contained.
    *   col (number) - this is only required is row was passed as a num.  Then,
    *                 this is the corresponding column value.
    *
    *   returns true if piece was removed, false if not found on board.
    */
   takePiece(pieceToTake, row, col){
     //if arg0 is a string, then parse algebraic to indeces
     if(typeof row === 'string'){
       [row,col] = this.algerbraicToIndeces(row);
     }
     // else if it is not a string or number, then it is an array of nums
     else if(typeof row !== number){
       [row,col] = row;
     }
     // if the piece to take does not currently reside at the given location,
     // return false
     if(this.getPieceAt(row,col) !== pieceToTake){
       return false;
     }

     //remove piece from board
     this.removePieceAt(row, col);

     //push piece to taken list
     if(pieceToTake.getColor() === 'w'){
       this.takenPiecesWhite.push(pieceToTake);
     }
     else if(pieceToTake.getColor() === 'b'){
       this.takenPiecesBlack.push(pieceToTake);
     }
     return true;
   }

  printBoard(board){
    let alphaCols = 'abcdefgh';

    //print a few newlines to give more space between board
    console.log('\n\n\n\n\n\n');

    //Print the top row of grid lines
    console.log(this.makeBoundaryLine(this.chars.upperLeft, this.chars.horizontal, this.chars.upperDiv, this.chars.upperRight, 3));

    // print a content line followed by the separating row of grid lines
    for(let i = 0; i < this.boardSize - 1; i++){

      console.log(this.makeContentLine(i, this.chars.vertical));
      console.log(this.makeBoundaryLine(this.chars.leftDiv, this.chars.horizontal, this.chars.centerDiv, this.chars.rightDiv, 3));
    }

    console.log(this.makeContentLine(this.boardSize - 1, this.chars.vertical));

    // bottom row of grid lines to finish grid
    console.log(this.makeBoundaryLine(this.chars.lowerLeft, this.chars.horizontal, this.chars.lowerDiv, this.chars.lowerRight, 3));

    // key row so columns are labeled per algebraic notation
    console.log(this.makeBottomKeyRow(alphaCols));

  }


  //helper function for printBoard
  makeContentLine(rowIndex, dividerChar){

    let line = ' ' + (this.boardSize-rowIndex) + ' ' + dividerChar;

    for(let i = 0; i < this.board[0].length; i++){
      line += this.makeCellContents(this.getPieceChar(this.board[rowIndex][i]));
      line += dividerChar;
    }

    // if this is the first content row, append list of black taken pieces
    if(rowIndex === 0){
      line += this.makeTakenContents(this.takenPiecesBlack);
    }
    // if this is the last content row, append list of white taken pieces
    if(rowIndex === this.board[0].length - 1){
      line += this.makeTakenContents(this.takenPiecesWhite);
    }

    return line;
  }

  makeTakenContents(takenArr){

    let line = this.makeSpacers(' ', 8);
    //console.log(takenArr[0]);
    for(let i = 0; i < takenArr.length; i++){
      line += this.getPieceChar(takenArr[i]) + ' ';
    }
    return line;
  }

  // helper function for printBoard
  makeBoundaryLine(leftChar, spacerChar, dividerChar, rightChar, leftOffset){
    let line = '';

    //apply left offset spacing
    for(let k = 0; k < leftOffset; k++){
      line += ' ';
    }

    line += leftChar;

    for(let i = 0; i < this.board.length; i++){
      line += this.makeSpacers(spacerChar, this.cellWidth);
      if(i < this.board.length - 1){
        line += dividerChar;
      }
    }
    line += rightChar;

    return line;

  }

  makeBottomKeyRow(keys){

    let line = '';
    //apply left offset spacing
    for(let k = 0; k < this.cellWidth; k++){
      line += ' ';
    }

    for(let i = 0; i < keys.length; i++){

        line += this.makeCellContents(keys[i]);
        line += ' '; // to account for divider in above rows
    }
    return line;
  }

  //helper helper
  makeCellContents(contentChar){

    let line = '';
    //if cell width is odd, divide evenly.
    //if cell width is even, favor right side.
    if(this.cellWidth % 2 == 1){
      line += this.makeSpacers(' ', parseInt(this.cellWidth/2));
      line += contentChar;
      line += this.makeSpacers(' ', parseInt(this.cellWidth/2));
    }
    else{
      line += this.makeSpacers(' ', parseInt(this.cellWidth/2 - 1));
      line += contentChar;
      line += this.makeSpacers(' ', parseInt(this.cellWidth/2));
    }

    return line;
  }


  //helper helper helper
  makeSpacers(spacerChar, numSpacers){
    let spaces = '';
    for(let i = 0; i < numSpacers; i++){
      spaces += spacerChar;
    }
    return spaces;
  }

  getPieceChar(piece){

    if(piece === undefined){
      return ' ';
    }
    let pieceId = piece.getColor() + piece.getType();

    switch(pieceId){
      case 'wk':  //White King
        return this.chars.whiteKing;
      case 'wq': //White Queen
        return this.chars.whiteQueen;
      case 'wr': //White Rook
        return this.chars.whiteRook;
      case 'wb': //White Bishop
        return this.chars.whiteBishop;
      case 'wn': //White Knight
        return this.chars.whiteKnight;
      case 'wp': //White Pawn
        return this.chars.whitePawn;
      case 'bk':  //Black King
        return this.chars.blackKing;
      case 'bq': //Black Queen
        return this.chars.blackQueen;
      case 'br': //Black Rook
        return this.chars.blackRook;
      case 'bb': //Black Bishop
        return this.chars.blackBishop;
      case 'bn': //Black Knight
        return this.chars.blackKnight;
      case 'bp': //Black Pawn
        return this.chars.blackPawn;
      default:
        return ' ';
    }
  }

  initializeBoardMap(){
    let alphaCols = 'abcdefgh';
    let map = {};
    // map algebraic notation to array row & col
    // e.g. - a1 == [0][7], h8 == [7][0]
    for(let c = 0; c < this.boardSize; c++){
      for(let r = 0; r < this.boardSize; r++){
        map[alphaCols[c] + (r + 1)] = [c,(this.boardSize - 1)-r];
      }
    }
    return map;
  }//END initializeBoardMap

}// END Board class











module.exports = {
  Board: Board
}

// var brd = new Board();
// console.log(brd.getPieceAt('a1'));
