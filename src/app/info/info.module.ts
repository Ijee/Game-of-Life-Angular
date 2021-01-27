import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InfoComponent} from './info.component';
import { InfoRoutingModule } from './info-routing.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [InfoComponent],
    imports: [
        CommonModule,
        InfoRoutingModule,
        FontAwesomeModule
    ]
})
export class InfoModule { }
