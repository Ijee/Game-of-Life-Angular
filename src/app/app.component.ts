import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {GameService} from './@core/services/game.service';
import {fadeAnimation} from './@core/animations/fadeAnimation';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
  public isNavbar: boolean;
  public isImport: boolean;
  public isExport: boolean;

  public mainComponent: string;


  private readonly destroyed$: Subject<void>;

  constructor(public gameService: GameService,
              library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
    this.mainComponent = 'gamePage';

    this.destroyed$ = new Subject<void>();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code === 'ArrowRight') {
      this.gameService.setStep();
    } else if (event.code === 'ArrowLeft') {
        this.gameService.setBackwardStep();
    } else if (event.code === 'Space') {
      this.gameService.setGameStatus();
    } else if (event.code === 'NumpadAdd') {
      this.gameService.setSpeedUp();
    } else if (event.code === 'NumpadSubtract') {
      this.gameService.setSpeedDown();
    } else if (event.code === 'KeyR') {
      this.gameService.setRedo();
    }
  }

  /**
   * Swaps out the current mainCompoment that
   * is seen on the screen.
   *
   * @param {string} component - the new component
   */
  swapComponent(component: string): void {
    this.mainComponent = component;
  }

  public getRouterOutletState(outlet): void {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
