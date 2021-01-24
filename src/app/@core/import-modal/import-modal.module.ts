import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImportModalComponent} from './import-modal.component';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [ImportModalComponent],
  exports: [
    ImportModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class ImportModalModule {
}
