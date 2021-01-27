import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {GameService} from '../../services/game.service';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {takeUntil} from 'rxjs/operators';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss']
})
export class ExportModalComponent implements OnInit, OnDestroy {
  showExport: boolean;

  private readonly destroyed$: Subject<void>;

  constructor(public gameService: GameService, library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
    this.showExport = false;

    this.destroyed$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.gameService.getExportSession().pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.showExport = true;
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  exportSession(): void {
    this.toClipboard();
    this.showExport = false;
  }

  /**
   * Copies the text in the #copystring input
   * to the users clipboard. May not work for
   * some clients.
   */
  toClipboard(): void {
    this.showExport = false;
    const copyString = document.querySelector('#copystring') as HTMLInputElement;
    copyString.setAttribute('type', 'text');
    copyString.select();
    document.execCommand('copy');
  }

}