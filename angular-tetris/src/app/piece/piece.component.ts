import { COLOURS, SHAPES } from './../constants';

export class Piece {
  public x: number;
  public y: number;
  public color: string;
  public shape: number[][];

  public constructor() {
    this.shape = SHAPES[this.getRandomNumber(SHAPES.length)];
    this.color = COLOURS[this.getRandomNumber(COLOURS.length)];
    this.x = 3;
    this.y = 0;
  }

  public rotate(): Piece {
    let p = new Piece;
    p.color = this.color;
    p.shape = this.shape;
    p.x = this.x;
    p.y = this.y;
    for (let y = 0; y < p.shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
      }
    }
    p.shape.forEach(row => row.reverse());
    return p;
  }

  public move(x: number, y: number) : Piece{    
    let p = new Piece;
    p.color = this.color;
    p.shape = this.shape;
    p.x = this.x + x;
    p.y = this.y + y;
    return p;
  }

  private getRandomNumber(noOfTypes: number): number {
    return Math.floor(Math.random() * noOfTypes);
  }
}