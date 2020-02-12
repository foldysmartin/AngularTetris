import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {COLUMNS, BLOCK_SIZE, ROWS} from './../constants';

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

  ngOnInit(): void {
    this.initBoard();
  }

  initBoard(){
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.ctx.canvas.width = COLUMNS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
  }

  play(){
    this.board = this.getEmptyBoard();
    console.table(this.board);
  }

  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
  }

}
