import { COLOURS, SHAPES } from './../constants';

export interface IPiece {
  x: number;
  y: number;
  colour: string;
  shape: number[][];
}

export class Piece implements IPiece {
  x: number;
  y: number;
  colour: string;
  shape: number[][];

  constructor(private ctx: CanvasRenderingContext2D){
    this.spawn();
  }

  spawn(){
    this.colour = 'blue';
    this.shape = [[2,0,0], [2,2,2], [0,0,0]];

    this.x = 3;
    this.y = 0;
  }

  draw() {
    this.ctx.fillStyle = this.colour;
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if(value > 0){
          this.ctx.fillRect(this.x + x, this.y + y, 1,1);
        }
      })
    })
  }

  move(p: IPiece){
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }
}