import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {far} from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss']
})
export class ControllerComponent {
  @Input('main-component') mainComponent: string;
  @Input('is-running') isRunning: boolean;
  @Output() send: EventEmitter<string>;

  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
    this.send = new EventEmitter<string>();
  }
}
