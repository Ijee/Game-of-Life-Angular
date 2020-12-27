import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Alive} from "../components";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnChanges {
  @Input() message: string;
  @Input('import-token') importToken: string;
  @Input('current-speed') currentSpeed: number;
  @Output() exportToken: EventEmitter<string>

  width: number;
  height: number;
  gridList: Alive[][];
  currentTick: number;
  cellCount: number;
  cellsAlive: number;
  cellsCreated: number;
  isMouseDown: boolean;

  constructor() {
    this.exportToken = new EventEmitter<string>();
    this.width = 46;
    this.height = 20;
    this.gridList = [];
    this.currentTick = 0;
    this.cellCount = 0;
    this.cellsAlive = 0;
    this.cellsCreated = 0;
  }

  ngOnInit() {
    this.cellCalc();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.message) {
      const val: string = changes.message.currentValue;
      if (val === 'nextStep') {
        this.update();
        this.currentTick++;
      } else if (val === 'redoSession') {
        this.reset();
      } else if (val === 'randomSeed') {
        this.randomSeed();
      } else if (val === 'importSession') {
        this.importSession();
      } else if (val === 'exportSession') {
        this.exportSession();
      }
    }
  }

  /**
   * Creates a 2D-Array during runtime for
   * the website to use for most operations.
   */
  cellCalc() {
    for (let i = 0; i < this.width; i++) {
      this.gridList[i] = [];
      for (let j = 0; j < this.height; j++) {
        this.gridList[i][j] = {isAlive: false};
      }
    }
    this.cellCount = this.width * this.height;
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
  setCell(x: number, y: number, alive: boolean) {
    if (this.gridList[x][y].isAlive != alive) {
      this.gridList[x][y].isAlive = alive;
      this.updateCellCount(alive);
    }
    // let row = this.gridList[x];
    // row.splice(y, 1, {isAlive: true});
    // this.gridList.splice(x, 1, row);
  }

  /**
   * The main function that updates the grid
   * every tick based on the game of life rules.
   */
  update() {
    let tempArr: boolean[][] = [];
    for (let i = 0; i < this.width; i++) {
      tempArr[i] = [];
      for (let j = 0; j < this.height; j++) {
        let status = this.gridList[i][j].isAlive;
        let neighbours = this.getNeighbours(i, j);
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
        if ((status && neighbours == 2) || neighbours == 3) {
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
        if (!status && neighbours == 3) {
          result = true;
        }
        tempArr[i][j] = result;
      }
    }
    // set new gridList content
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.setCell(i, j, tempArr[i][j]);
      }
    }
  }

  /**
   * Returns the amount of neighbours for
   * a specific cell on the grid.
   *
   * @param {number} posX - the x position
   * @param {number} posY - the Y position
   * @return {number} neighbours - amount of neighbours
   */
  getNeighbours(posX: number, posY: number) {
    let neighbours = 0;
    if (posX <= this.width && posY <= this.height) {
      for (let offsetX = -1; offsetX < 2; offsetX++) {
        for (let offsetY = -1; offsetY < 2; offsetY++) {
          let newX = posX + offsetX;
          let newY = posY + offsetY;
          // check if offset is:
          // on current cell, out of bounds and if isAlive
          // for cell true
          if (
            (offsetX != 0 || offsetY != 0) &&
            newX >= 0 &&
            newX < this.width &&
            newY >= 0 &&
            newY < this.height &&
            this.gridList[posX + offsetX][posY + offsetY].isAlive == true
          ) {
            neighbours++;
          }
        }
      }
    }
    return neighbours;
  }

  /**
   * Resets all gridList cells back to the
   * start value.
   */
  reset() {
    this.currentTick = 0;
    this.cellsAlive = 0;
    this.cellsCreated = 0;
    this.gridList.forEach((col) => {
      col.forEach((cell) => {
        cell.isAlive = false;
      });
    });
  }

  /**
   * Populates and overwrites gridList with cells.
   */
  randomSeed() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        let rand = Math.random();
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
  importSession() {
    this.reset();
    let regex = /\[\d+,\d+\]/gm;
    let tempArr = this.importToken.match(regex);
    if (tempArr) {
      tempArr.forEach((element) => {
        element = element.substring(1, element.length - 1);
        let xy = element.split(',');
        this.setCell(+xy[0], +xy[1], true);
      });
    }
  }

  /**
   * Uses gridList to create an exportToken and
   * emits it up to App.vue for the user to copy.
   * Same format as in importToken().
   */
  exportSession() {
    let exportToken = '';
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.gridList[i][j].isAlive) {
          exportToken += '[' + i + ',' + j + ']';
        }
      }
    }
    this.exportToken.emit(exportToken);
  }

  /**
   * Updates the current cellcount on each new tick.
   *
   * @param {boolean} bool - boolean based on cell isAlive status
   */
  updateCellCount(bool: boolean) {
    if (bool) {
      this.cellsAlive++;
      this.cellsCreated++;
    } else {
      this.cellsAlive--;
    }
  }
}
