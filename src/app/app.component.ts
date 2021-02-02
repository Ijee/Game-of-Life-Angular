import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {GameService} from './@core/services/game.service';
import {fadeAnimation} from './@shared/animations/fadeAnimation';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

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


  private readonly destroyed$: Subject<void>;

  constructor(library: FaIconLibrary, public gameService: GameService,
              private router: Router,
              private location: Location) {
    library.addIconPacks(fas, fab, far);
    this.destroyed$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      if (this.location.path() === '/game') {
        this.gameService.setDisableController(false);
      } else {
        this.gameService.setDisableController(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.code === 'ArrowRight') {
      this.gameService.addStep();
    } else if (event.code === 'ArrowLeft') {
      this.gameService.setBackwardStep();
    } else if (event.code === 'Space') {
      this.gameService.setGameStatus();
    } else if (event.code === 'NumpadAdd') {
      this.gameService.setSpeedUp();
    } else if (event.code === 'NumpadSubtract') {
      this.gameService.setSpeedDown();
    } else if (event.code === 'KeyR') {
      this.gameService.reset();
    }
  }

  public getRouterOutletState(outlet): void {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
