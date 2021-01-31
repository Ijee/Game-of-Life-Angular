import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then(m => m.GameModule),
    data: { reuse: true, key: 'game' }

  },
  {
    path: 'info',
    loadChildren: () => import('./info/info.module').then(m => m.InfoModule),
    data: { reuse: false, key: 'info' }
  },
  {
    path: '',
    redirectTo: '/game',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
