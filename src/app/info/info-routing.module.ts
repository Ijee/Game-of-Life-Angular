import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InfoComponent} from './info.component';

const routes: Routes = [
  {
    path: '', component: InfoComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class InfoRoutingModule { }
