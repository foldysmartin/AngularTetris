import { Injectable } from '@angular/core';
import { IPiece } from './piece/piece.component';
import { COLUMNS, ROWS, POINTS } from './constants';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  valid(p: IPiece, board: number[][]): boolean {
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

  getLinesClearedPoints(lines: number, level: number): number {
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
}