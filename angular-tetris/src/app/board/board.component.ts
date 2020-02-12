import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {COLUMNS, BLOCK_SIZE, ROWS} from './../constants';
import { Piece } from '../piece/piece.component';

@Component({
  selector: 'game-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {

  @ViewChild('board', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  ctx:CanvasRenderingContext2D;
  points: number;
  lines: number;
  level: number;
  board: number[][];
  piece: Piece;

  ngOnInit(): void {
    this.initBoard();
  }

  initBoard(){
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.ctx.canvas.width = COLUMNS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  play(){
    this.board = this.getEmptyBoard();
    this.piece = new Piece(this.ctx);
    this.piece.draw();
    console.table(this.board);
  }

  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
  }

}
