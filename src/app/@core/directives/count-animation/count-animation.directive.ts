import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appCountAnimation]'
})
export class CountAnimationDirective implements OnChanges {
  @Input() newValue: number;
  @Input() duration: number;
  @Input() disableAnimation: boolean;

  private readonly refreshInterval: number;
  private intervalID: number;


  constructor(private elementRef: ElementRef) {
    this.duration = 500;
    this.disableAnimation = false;
    this.refreshInterval = 30;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.newValue) {
      clearInterval(this.intervalID);
      if (this.disableAnimation) {
        this.currentValue = this.newValue;
      } else {
        const steps = Math.floor(this.duration / this.refreshInterval);
        const increment = (this.newValue - this.currentValue) / steps;
        let step = 0;
        let internalValue = this.currentValue;
        this.intervalID = setInterval(() => {
          step++;
          if (step === steps - 1) {
            this.currentValue = this.newValue;
            clearInterval(this.intervalID);
          } else {
            internalValue += increment;
            this.currentValue = Math.floor(internalValue);
          }
        }, this.refreshInterval);
      }
    }
  }

  private get currentValue(): number {
    return +this.elementRef.nativeElement.innerHTML;
  }

  private set currentValue(val: number) {
    this.elementRef.nativeElement.innerHTML = val;
  }
}
