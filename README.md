# chess
Commandline chess game

## Installation

For and clone this repository.

Then run ```npm install```
(the package 'readline-sync' is required to interface with the game).

## To play

In the commandline terminal, launch the game using node by entering
```
node /path/to/game.js
```
Answer the initial questions and begin playing.

### The Board
The board is a standard 8x8 square chess board.  Unfortunately, since it is rendered in commandline, it was not possible to change the background colors of each square.  This might make it a little more difficult to track, say, a long, diagonal move.  However, the game's logic will not allow for moving to an illegal position.

The board is divided into ranks and files like any other chess board.  The ranks are represented by numbers along the left side of the board and files are represented by letters across the bottom.

![board](https://user-images.githubusercontent.com/22224664/33736873-8138152a-db51-11e7-9fa8-c34c568ee448.png)



### Algebraic Notation

To enter a move, you will be using algebraic notation.  The general format for this is
```<piece><rank><file>```
For example, if you wanted to move a pawn to D4, you would enter ```PD4```.  (Case does not matter.)

Optionally, if you want to follow algebraic notation's tradition of denoting taking a piece with the use of 'x', you may do so (although it is not necessary).  For example, ```QxE6``` to represent the Queen taking the piece at position E6.

If more than one piece of the same side may move to the same position, you will be prompted to be more specific in your notation.  You may then follow the ```<piece>``` portion with its own rank or file.  For example, if you have a Knight on position D5 as well as position G6 and you enter ```NF4``` (or ```NxF4```), you will see that either one can move to the target square.  When you are reprompted, you will need to specify ```NDF4``` or ```N5F4``` so the game knows which one to move.  File (letter) traditional takes precedence over rank (number), but either one will work.

### Winning

There are two ways a game may (gracefully) end; the king may be taken or a player may resign.  For a player to resign, they need simply type ```resign```.

## Things Not Being Implemented Yet

There are a few elements of gameplay that are not yet implemented but are intended to be added down the road.  They are: en passant, castling, pawn promotion.

One gameplay feature that will likely not be implemented is preventing the king from moving into check.  Similarly, requiring a player to move out of check if at all possible will also not be in the game's logic.

### Undo and Redo

Eventually, a player will be able to undo a move and redo moves that have been undone up until a new move is played.  

### Game printout

Related to undo/redo (since the moves are all being recorded), it should be possible in the future to have a game's playlist displayed following the conclusion of a match.  It might also be possible to replay a game visually.
