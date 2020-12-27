import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Alive} from "../components";

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {
  @Input('status-obj') statusObj: Alive;
  @Input('is-mouse-down') isMouseDown: boolean;
  @Output() wasUpdated: EventEmitter<boolean>;

  constructor() {
    this.wasUpdated = new EventEmitter<boolean>();
  }

  reborn(bool: boolean) {
    if (bool) {
      this.statusObj.isAlive = !this.statusObj.isAlive;
      this.wasUpdated.emit(this.statusObj.isAlive);
    }
  }
}
