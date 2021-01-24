import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ControllerComponent} from './controller/controller.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ControllerComponent],
  exports: [
    ControllerComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class CoreModule { }
