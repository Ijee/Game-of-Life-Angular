import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GridComponent} from './grid/grid.component';
import {CellComponent} from './grid/cell/cell.component';
import {StatsComponent} from './grid/stats/stats.component';
import {GameRoutingModule} from './game-routing.module';

@NgModule({
  declarations: [GridComponent, CellComponent, StatsComponent],
  imports: [
    CommonModule,
    GameRoutingModule
  ],
  providers: []
})
export class GameModule { }
