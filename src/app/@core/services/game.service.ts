import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {Alive} from '../../../types';


@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly gridList$: ReplaySubject<Alive[][]>;
  private readonly gridHistory: Array<Alive[][]>;
  private readonly tick$: BehaviorSubject<number>;
  private readonly cellCount$: BehaviorSubject<number>;
  private readonly cellsAlive$: BehaviorSubject<number>;
  private readonly cellsAliveHistory: Array<number>;
  private readonly cellsCreated$: BehaviorSubject<number>;
  private readonly cellsCreatedHistory: Array<number>;
  private rewritingHistory: boolean;
  private readonly gameSpeed$: BehaviorSubject<number>;
  private readonly disableController$: BehaviorSubject<boolean>;
  private readonly isGameActive$: BehaviorSubject<boolean>;
  private readonly backwardStep$: Subject<void>;
  private readonly backwardStepsAmount$: BehaviorSubject<number>;
  private readonly step$: Subject<void>;
  private readonly randomSeed$: Subject<void>;
  private readonly importSession$: Subject<void>;
  private readonly exportSession$: Subject<void>;
  private readonly exportToken$: Subject<string>;
  private readonly importToken$: Subject<string>;

  private intervalID: number;

  constructor() {
    this.gridList$ = new ReplaySubject<Alive[][]>(5);
    this.gridList$.next([]);
    this.gridHistory = [];
    // Stats
    this.tick$ = new BehaviorSubject<number>(0);
    this.cellCount$ = new BehaviorSubject<number>(0);
    this.cellsAlive$ = new BehaviorSubject<number>(0);
    this.cellsAliveHistory = [0];
    this.cellsCreated$ = new BehaviorSubject<number>(0);
    this.cellsCreatedHistory = [0];
    this.rewritingHistory = false;
    // Responsible for controlling the simulation - also used to propagate
    // events from the controller component
    this.gameSpeed$ = new BehaviorSubject(100);
    this.disableController$ = new BehaviorSubject<boolean>(false);
    this.isGameActive$ = new BehaviorSubject(false);
    this.backwardStep$ = new Subject<void>();
    this.backwardStepsAmount$ = new BehaviorSubject<number>(0);
    this.step$ = new Subject<void>();
    this.randomSeed$ = new Subject<void>();
    this.importSession$ = new Subject<void>();
    this.exportSession$ = new Subject<void>();
    this.exportToken$ = new Subject<string>();
    this.importToken$ = new Subject<string>();
  }

  /**
   * Restarts the current interval that
   * is used to call the updateMessage method.
   */
  private restartInterval(): void {
    clearInterval(this.intervalID);
    if (this.isGameActive$.getValue()) {
      this.intervalID = setInterval(() => this.addStep(), 50000 / this.gameSpeed$.getValue());
    }
  }

  public setGameStatus(status?: boolean): void {
    if (status !== undefined) {
      this.isGameActive$.next(status);
    } else {
      this.isGameActive$.next(!(this.isGameActive$.getValue()));
    }
    this.restartInterval();
  }

  private setGameSpeed(speed: number): void {
    const newSpeed = this.gameSpeed$.getValue() + speed;
    this.gameSpeed$.next(newSpeed);
    if (this.gameSpeed$.getValue() < 20) {
      this.gameSpeed$.next(20);
    } else if (this.gameSpeed$.getValue() > 500) {
      this.gameSpeed$.next(500);
    }
  }

  public changeTick(value: number): void {
    this.tick$.next(this.tick$.getValue() + value);
  }

  public setCellCount(newCellCount: number): void {
    this.cellCount$.next(newCellCount);
  }

  public changeCellsAlive(value: number): void {
    this.cellsAlive$.next(this.cellsAlive$.getValue() + value);
  }

  public changeCellsCreated(value: number): void {
    this.cellsCreated$.next(this.cellsCreated$.getValue() + value);
  }

  public setDisableController(disabled: boolean): void {
    this.disableController$.next(disabled);
  }

  public setGridList(newGrid: Alive[][]): void {
    console.log('____');
    console.log('just got a new gridList', newGrid);
    this.gridList$.next(newGrid);
  }

  public setBackwardStep(): void {
    // disables auto-play of the simulation
    if (this.isGameActive$.getValue()) {
      this.isGameActive$.next(false);
      this.restartInterval();
    }
    console.log('backwardStepAmount:', this.backwardStepsAmount$.getValue());
    if (this.backwardStepsAmount$.getValue() > 0) {
      this.changeBackwardStepsAmount(-1);
      this.backwardStep$.next();
    }
  }

  /**
   * (Don't question good method names or I will haunt you)
   * @param value
   * @private
   */
  private changeBackwardStepsAmount(value: number): void {
    this.backwardStepsAmount$.next(this.backwardStepsAmount$.value + value);
  }

  public setStep(newGrid: Alive[][]): void {
    this.setGridList(newGrid);
    this.changeTick(1);
    if (this.backwardStepsAmount$.getValue() < 5) {
      this.changeBackwardStepsAmount(1);
    }
  }

  public addStep(): void {
    this.step$.next();
    if (this.backwardStepsAmount$.getValue() < 5) {
      this.changeBackwardStepsAmount(1);
    }
  }

  public setHistory(gridList: Alive[][]): void {
    if (this.gridHistory.length >= 6) {
      this.gridHistory.shift();
      this.cellsCreatedHistory.shift();
      this.cellsAliveHistory.shift();
      this.gridHistory.push(gridList);
      console.log('just got a new gridHistory in if case');
      this.cellsCreatedHistory.push(this.cellsCreated$.getValue());
      this.cellsAliveHistory.push(this.cellsAlive$.getValue());
    } else {
      this.gridHistory.push(gridList);
      console.log('just got a new gridHistory in else case');
      this.cellsCreatedHistory.push(this.cellsCreated$.getValue());
      this.cellsAliveHistory.push(this.cellsAlive$.getValue());
    }
    console.log('newest gridHistory element:', this.gridHistory);
  }

  public setRewritingHistory(newValue: boolean): void {
    this.rewritingHistory = newValue;
  }

  /**
   * this manipulates the gridHistory array when the backwardsStep
   * is clicked on the controller
   */
  public manipulateHistory(): void {
    console.log('in manipulate history');
    this.gridHistory.pop();
    this.setGridList(this.gridHistory[this.gridHistory.length - 1]);
    this.setRewritingHistory(false);
    this.cellsCreatedHistory.pop();
    this.cellsCreated$.next(this.cellsCreatedHistory[this.cellsCreatedHistory.length - 1]);
    this.cellsAliveHistory.pop();
    this.cellsAlive$.next(this.cellsAliveHistory[this.cellsAliveHistory.length - 1]);
  }

  public setSpeedDown(): void {
    this.gameSpeed$.getValue() > 100 ? this.setGameSpeed(-100) : this.setGameSpeed(-20);
    this.restartInterval();
  }

  public setSpeedUp(): void {
    this.gameSpeed$.getValue() < 100 ? this.setGameSpeed(20) : this.setGameSpeed(100);
    this.restartInterval();
  }

  public reset(): void {
    this.backwardStepsAmount$.next(0);
    this.tick$.next(0);
    this.cellsAlive$.next(0);
    this.cellsCreated$.next(0);
    this.gridList$.next([]);
  }

  public setRandomSeed(): void {
    this.randomSeed$.next();
  }

  public setImportSession(): void {
    this.importSession$.next();
  }

  public setExportSession(): void {
    this.exportSession$.next();
  }

  public setExportToken(token: string): void {
    this.exportToken$.next(token);
  }

  public setImportToken(token: string): void {
    this.importToken$.next(token);
  }

  public getGridList(): Observable<Alive[][]> {
    return this.gridList$;
  }

  public getDisableController(): Observable<boolean> {
    return this.disableController$;
  }

  public getGameStatus(): Observable<boolean> {
    return this.isGameActive$;
  }

  public getTick(): Observable<number> {
    return this.tick$;
  }

  public getCellCount(): Observable<number> {
    return this.cellCount$;
  }

  public getCellsAlive(): Observable<number> {
    return this.cellsAlive$;
  }

  public getCellsCreated(): Observable<number> {
    return this.cellsCreated$;
  }

  public getRewritingHistory(): boolean {
    return this.rewritingHistory;
  }

  public getGameSpeed(): Observable<number> {
    return this.gameSpeed$;
  }

  public getBackwardStep(): Observable<void> {
    return this.backwardStep$;
  }

  public getBackwardStepsAmount(): Observable<number> {
    return this.backwardStepsAmount$;
  }

  public getStep(): Observable<void> {
    return this.step$;
  }

  public getRandomSeed(): Observable<void> {
    return this.randomSeed$;
  }

  public getImportSession(): Observable<void> {
    return this.importSession$;
  }

  public getExportSession(): Observable<void> {
    return this.exportSession$;
  }

  public getExportToken(): Observable<string> {
    return this.exportToken$;
  }

  public getImportToken(): Observable<string> {
    return this.importToken$;
  }
}
