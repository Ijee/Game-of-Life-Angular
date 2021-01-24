import {Component, OnDestroy, OnInit,} from '@angular/core';
import {Alive} from '../../../types';
import {GameService} from '../../@core/services/game.service';
import {Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnDestroy {

  private readonly width: number;
  private readonly height: number;
  private readonly historyState: Array<Alive[][]>;
  private rewritingHistory: boolean;
  public gridList: Alive[][];
  public isMouseDown: boolean;

  private readonly destroyed$: Subject<void>;

  constructor(public gameService: GameService) {
    this.width = 46;
    this.height = 20;
    this.historyState = [];
    this.rewritingHistory = false;
    this.gridList = [];

    this.destroyed$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.cellCalc();
    this.gameService.getGridList().pipe(takeUntil(this.destroyed$)).subscribe(data => {
      data.forEach((column, i) => {
        column.forEach((cell, j) => {
          this.setCell(i, j, cell.isAlive);
        });
      });
      console.log('data', data);
      if (!this.rewritingHistory) {
        console.log('data is being updated... checking historyState:');
        if (this.historyState.length >= 5) {
          this.historyState.shift();
          this.historyState.push(data);
        } else {
          this.historyState.push(data);
        }
      }
      console.log('historyState;', this.historyState);
    });

    this.gameService.getBackwardStep().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.rewritingHistory = true;
      this.manipulateHistory();
      this.gameService.changeTick(-1);
    });
    this.gameService.getStep().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.update();
      this.gameService.changeTick(1);
    });
    this.gameService.getRedo().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.reset();
    });
    this.gameService.getRandomSeed().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.randomSeed();
    });
    this.gameService.getImportToken().pipe(takeUntil(this.destroyed$)).subscribe((token: string) => {
      this.importToken(token);
    });
    this.gameService.getExportSession().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.exportSession();
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Creates a 2D-Array during runtime for
   * the website to use for most operations.
   */
  cellCalc(): void {
    this.gameService.getGridList().pipe(take(1)).subscribe((data) => {
      if (data.length === 0) {
        const tempArr: Alive[][] = [];
        for (let i = 0; i < this.width; i++) {
          // TODDO: make loop in ngoninit with gridlist - row 95 / 98
          // magic - fixes first iteration
          tempArr[i] = [];
          this.gridList[i] = [];
          for (let j = 0; j < this.height; j++) {
            tempArr[i][j] = {isAlive: false};
            this.gridList[i][j] = {isAlive: false};
          }
        }
        this.gameService.setGridList(tempArr);
      } else {
        this.gridList = data;
      }
    });
    this.gameService.setCellCount(this.width * this.height);
  }

  /**
   * Changes the 'isAlive' object property
   * of a specific cell to the one requested
   * in the param.
   *
   * @param {number} x - the x position
   * @param {number} y - the y position
   * @param {boolean} alive - the new boolean
   */
  setCell(x: number, y: number, alive: boolean): void {
    if (this.gridList[x][y].isAlive !== alive) {
      this.gridList[x][y].isAlive = alive;

      this.updateCellStats(alive);
    }
    // let row = this.gridList[x];
    // row.splice(y, 1, {isAlive: true});
    // this.gridList.splice(x, 1, row);
  }

  /**
   * Returns the amount of neighbours for
   * a specific cell on the grid.
   *
   * @param {number} posX - the x position
   * @param {number} posY - the Y position
   * @return {number} neighbours - amount of neighbours
   */
  getNeighbours(posX: number, posY: number): number {
    let neighbours = 0;
    if (posX <= this.width && posY <= this.height) {
      for (let offsetX = -1; offsetX < 2; offsetX++) {
        for (let offsetY = -1; offsetY < 2; offsetY++) {
          const newX = posX + offsetX;
          const newY = posY + offsetY;
          // check if offset is:
          // on current cell, out of bounds and if isAlive
          // for cell true
          if (
            (offsetX !== 0 || offsetY !== 0) &&
            newX >= 0 &&
            newX < this.width &&
            newY >= 0 &&
            newY < this.height &&
            this.gridList[posX + offsetX][posY + offsetY].isAlive === true
          ) {
            neighbours++;
          }
        }
      }
    }
    return neighbours;
  }

  /**
   * this manipulates the historyState array when the backwardsStep
   * is clicked on the controller
   */
  manipulateHistory(): void {
    console.log('trying to rewrite history');
    console.log(this.historyState.pop());
    this.gameService.setGridList(this.historyState[this.historyState.length - 1]);
    this.rewritingHistory = false;
    console.log('manipulate history end');
  }

  /**
   * The main function that updates the grid
   * every tick based on the game of life rules.
   */
  update(): void {
    const tempArr: Alive[][] = [];
    for (let i = 0; i < this.width; i++) {
      tempArr[i] = [];
      for (let j = 0; j < this.height; j++) {
        const status = this.gridList[i][j].isAlive;
        const neighbours = this.getNeighbours(i, j);
        let result = false;
        // Rule 1:
        // Any live cell with fewer than two live neighbours dies,
        // as if by under population
        if (status && neighbours < 2) {
          result = false;
        }
        // Rule 2:
        // Any live cell with two or three neighbours lives on
        // to the next generation
        if ((status && neighbours === 2) || neighbours === 3) {
          result = true;
        }
        // Rule 3:
        // Any live cell with more than three live neighbours dies,
        // as if by overpopulation
        if (status && neighbours > 3) {
          result = false;
        }
        // Rule 4:
        // Any dead cell with exactly three live neighbours becomes
        // a live cell, as if by reproduction
        if (!status && neighbours === 3) {
          result = true;
        }
        tempArr[i][j] = {isAlive: result};
      }
    }
    // set new gridList content
    this.gameService.setGridList(tempArr);
  }

  /**
   * Resets all gridList cells back to the
   * start value.
   */
  reset(): void {
    this.gridList.forEach((col) => {
      col.forEach((cell) => {
        cell.isAlive = false;
      });
    });
  }

  /**
   * Populates and overwrites gridList with cells.
   */
  randomSeed(): void {
    this.gameService.setRedo();
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const rand = Math.random();
        if (rand < 0.2) {
          this.setCell(i, j, true);
        } else {
          this.setCell(i, j, false);
        }
      }
    }
  }

  /**
   * Resets and then imports new cells into the gridList
   * based on the importToken prop that gets passed down
   * App.vue.
   * The importToken is a string and its syntax looks
   * like this:
   * '[xPos,yPos],[xPos,yPos]...'.
   */
  importToken(token: string): void {
    this.reset();
    const regex = /\[\d+,\d+\]/gm;
    const tempArr = token.match(regex);
    if (tempArr) {
      tempArr.forEach((element) => {
        element = element.substring(1, element.length - 1);
        const xy = element.split(',');
        this.setCell(+xy[0], +xy[1], true);
      });
    }
  }

  /**
   * Uses gridList to create an exportToken and
   * emits it up to App.vue for the user to copy.
   * Same format as in importToken().
   */
  exportSession(): void {
    let exportToken = '';
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.gridList[i][j].isAlive) {
          exportToken += '[' + i + ',' + j + ']';
        }
      }
    }
    this.gameService.setExportToken(exportToken);
  }

  /**
   * Updates the current cell stats on each new tick.
   *
   * @param {boolean} bool - boolean based on cell isAlive status
   */
  updateCellStats(bool: boolean): void {
    if (bool) {
      this.gameService.changeCellsAlive(1);
      this.gameService.changeCellsCreated(1);
    } else {
      this.gameService.changeCellsAlive(-1);
    }
  }
}
