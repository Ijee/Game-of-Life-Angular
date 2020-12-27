import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid/grid.component';
import { CellComponent } from './cell/cell.component';
import { InfoComponent } from './info/info.component';
import { ControllerComponent } from './controller/controller.component';
import { StatsComponent } from './stats/stats.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";



@NgModule({
    declarations: [GridComponent, CellComponent, InfoComponent, ControllerComponent, StatsComponent],
  exports: [
    GridComponent,
    InfoComponent,
    ControllerComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class ComponentsModule { }
