import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appCountAnimation]'
})
export class CountAnimationDirective implements OnChanges{
  @Input() newValue: number;
  @Input() duration: number;
  @Input() disableAnimation: boolean;

  private readonly refreshInterval: number;
  private currentValue: number;
  private steps: number;
  private increment: number;
  private intervalID: number;


  constructor(private elementRef: ElementRef) {
    this.duration = 500;
    this.disableAnimation = false;
    this.refreshInterval = 30;


    elementRef.nativeElement.style.color = 'red';
  }

  ngOnChanges(changes: SimpleChanges): void {
    clearInterval(this.intervalID);
    this.currentValue = Number(this.elementRef.nativeElement.innerHTML);
    this.steps = Math.floor(this.duration / this.refreshInterval);
    this.increment = Math.floor((this.newValue - this.currentValue) / this.steps);
    if (this.disableAnimation) {
      this.elementRef.nativeElement.innerHTML = this.newValue;
    } else {
      this.intervalID = setTimeout(() => {
          this.elementRef.nativeElement.innerHTML = this.currentValue + this.increment;
          console.log('I am actually in the timeout');
      }, this.steps);
    }
  }
}
