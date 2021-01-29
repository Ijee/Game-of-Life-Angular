import {Component, Input} from '@angular/core';
import {GameService} from '../../../@core/services/game.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  @Input('cell-count') cellCount: number;

  public test: number;
  constructor(public gameService: GameService) {
    this.test = 0;
  }

  increase(): void {
    this.test += 100;
  }
}
