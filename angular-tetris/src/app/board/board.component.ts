import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  HostListener
} from '@angular/core';
import {
  COLUMNS,
  BLOCK_SIZE,
  ROWS,
  COLOURS,
  LINES_PER_LEVEL,
  LEVEL,
  POINTS,
  KEY
} from './../constants';
import { Piece } from './../piece/piece.component';
import { GameService } from './../game.service';

@Component({
  selector: 'game-board',
  templateUrl: 'board.component.html'
})
export  class BoardComponent implements OnInit {
  @ViewChild('board', { static: true })
  public canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('next', { static: true })
  public canvasNext: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D;
  public ctxNext: CanvasRenderingContext2D;
  public time: { start: number; elapsed: number; level: number };  

  public points: number;
  public lines: number;
  public level: number;

  private requestId: number;  

  @HostListener('window:keydown', ['$event'])
  public keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY.ESC) {
      this.gameOver();
    } else {
      event.preventDefault();
      if(event.keyCode === KEY.LEFT){
        this.service.move(-1, 0);
      }else if(event.keyCode === KEY.RIGHT){
        this.service.move(1, 0);
      }else if(event.keyCode === KEY.DOWN){
        this.service.fastDrop();
      }else if(event.keyCode === KEY.SPACE){
        this.service.instantDrop();
      }else if(event.keyCode === KEY.UP){
        this.service.rotate();
      }
    }
  }

  public constructor(private service: GameService) {
    this.level = 0;
    console.log(this.level)

    service.levelChangedEvent.subscribe(level => {
      this.level = level;
      this.time.level = LEVEL[level];    
    })

    service.lineClearedEvent.subscribe(piece =>{
      this.lines++;
    })

    service.pointsChangedEvent.subscribe(points =>{
      this.points = points;
    })

    service.nextPieceEvent.subscribe(piece =>{
      this.drawNextPiece(piece);
    })
    
  }

  public ngOnInit() {
    this.initBoard();
    this.initNext();
    this.resetGame();
  }
  
  public play() {
    this.resetGame();
    this.service.play(this.ctx);
    this.time.start = performance.now();

    // If we have an old game running a game then cancel the old
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }

    this.animate();
  }

  private initBoard() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.ctx.canvas.width = COLUMNS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  private initNext() {
    this.ctxNext = this.canvasNext.nativeElement.getContext('2d');

    this.ctxNext.canvas.width = 4 * BLOCK_SIZE;
    this.ctxNext.canvas.height = 4 * BLOCK_SIZE;

    this.ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  private resetGame() {    
    this.points = 0;
    this.lines = 0;
    this.level = 0;
    this.time = { start: 0, elapsed: 0, level: LEVEL[this.level] };
  }

  private animate(now = 0) {    
    this.time.elapsed = now - this.time.start;
    if (this.time.elapsed > this.time.level) {
      this.time.start = now;
      if (!this.service.drop()) {
        this.gameOver();
        return;
      }
    }
    this.draw();
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.drawBoard();
    this.drawPiece(this.service.piece, this.ctx);
  }

  private drawBoard() {
    this.service.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctx.fillStyle = COLOURS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  private drawPiece(piece: Piece, ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = piece.color;
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          ctx.fillRect(piece.x + x, piece.y + y, 1, 1);
        }
      });
    });    
  } 

  private drawNextPiece(piece: Piece){
    this.ctxNext.clearRect(0, 0, this.ctxNext.canvas.width+1, this.ctxNext.canvas.height+1);
    this.ctxNext.fillStyle = piece.color;
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.ctxNext.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  private gameOver() {
    cancelAnimationFrame(this.requestId);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(1, 3, 8, 1.2);
    this.ctx.font = '1px Arial';
    this.ctx.fillStyle = 'red';
    this.ctx.fillText('GAME OVER', 1.8, 4);
  }
}