import { Injectable } from '@angular/core';
import { Piece } from './piece/piece.component';
import { COLUMNS, ROWS, POINTS, LINES_PER_LEVEL } from './constants';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public board: number[][];
  public piece: Piece;
  public next: Piece;  
  private points: number;
  private lines: number;
  private level: number;
  
  private levelChanged = new Subject<number>();
  public levelChangedEvent = this.levelChanged.asObservable();

  private lineCleared = new Subject();
  public lineClearedEvent = this.lineCleared.asObservable();

  private pointsChanged = new Subject<number>();
  public pointsChangedEvent = this.pointsChanged.asObservable();

  private nextPieceChanged = new Subject<Piece>();
  public nextPieceEvent = this.nextPieceChanged.asObservable();

  public play(ctx: CanvasRenderingContext2D){
    this.resetGame()
    this.createNextPiece();
    this.piece = new Piece();
  }   

  public move(x: number, y:number){
    var movedPiece = this.piece.move(x, y);
    if(this.valid(movedPiece, this.board)){      
      this.piece = movedPiece;
    }
  }

  public instantDrop(){    
    var movedPiece = this.piece.move(0, 1);
    while(this.valid(movedPiece, this.board)){
      this.addPoints(POINTS.HARD_DROP);         
      this.piece = movedPiece;   
      movedPiece = this.piece.move(0, 1);
      
    }
  }

  public fastDrop(){
    var movedPiece = this.piece.move(0, 1);
    if(this.valid(movedPiece, this.board)){
      this.piece = movedPiece;
      this.addPoints(POINTS.SOFT_DROP);
    }
  }

  public rotate(){
    var rotatedPiece = this.piece.rotate();
    if(this.valid(rotatedPiece, this.board)){      
      this.piece = rotatedPiece;
    }
  }
  
  public drop(): boolean {     
    var movedPiece = this.piece.move(0,1);
    if (this.valid(movedPiece, this.board)) {      
      this.piece = movedPiece;
    } else {      
      console.log(false);
      this.freeze();
      this.clearLines();
      if (this.piece.y === 0) {
        // Game over
        return false;
      }      

      this.piece = this.next;    
      this.createNextPiece();
    }
    return true;
  }  

  private createNextPiece() {
    this.next = new Piece();
    this.nextPieceChanged.next(this.next);
  }
  
  private resetGame(){    
    this.points = 0;
    this.lines = 0;
    this.level = 0;
    this.board = this.getEmptyBoard();
  }

  private valid(p: Piece, board: number[][]): boolean {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (
          this.isEmpty(value) ||
          (this.insideWalls(x) &&
            this.aboveFloor(y) &&
            this.notOccupied(board, x, y))
        );
      });
    });
  }

  private isEmpty(value: number): boolean {
    return value === 0;
  }

  private insideWalls(x: number): boolean {
    return x >= 0 && x < COLUMNS;
  }

  private aboveFloor(y: number): boolean {
    return y <= ROWS;
  }

  private notOccupied(board: number[][], x: number, y: number): boolean {
    return board[y] && board[y][x] === 0;
  }  
  
  private getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
  }   

  private clearLines() {
    let lines = 0;
    this.board.forEach((row, y) => {
      if (row.every(value => value !== 0)) {
        lines++;
        this.board.splice(y, 1);
        this.board.unshift(Array(COLUMNS).fill(0));
      }
    });
    if (lines > 0) {
      this.addPoints(this.getLinesClearedPoints(lines, this.level));
      this.lines += lines;
      this.lineCleared.next();
      if (this.lines >= LINES_PER_LEVEL) {
        this.level++;
        this.levelChanged.next(this.level);
        this.lines -= LINES_PER_LEVEL;
        
      }
    }
  }

  private freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.board[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  private getLinesClearedPoints(lines: number, level: number): number {
    const lineClearPoints =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
        ? POINTS.TRIPLE
        : lines === 4
        ? POINTS.TETRIS
        : 0;

    return (level + 1) * lineClearPoints;
  }

  private addPoints(points: number){
    this.points +=  points;
    this.pointsChanged.next(this.points);
  }
}