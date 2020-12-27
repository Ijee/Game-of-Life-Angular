import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  @Input('current-tick') currentTick: number;
  @Input('cell-count') cellCount: number;
  @Input('cells-alive') cellsAlive: number;
  @Input('cells-created') cellsCreated: number;
  @Input('current-speed') currentSpeed: number;
}
