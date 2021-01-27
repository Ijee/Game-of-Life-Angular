import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appCountAnimation]'
})
export class CountAnimationDirective {
  @Input() duration: number;
  @Input() newValue: number;

  private readonly refreshInterval: number;
  private readonly currentValue: number;
  private  readonly steps: number;
  private increment: number;


  constructor(private elementRef: ElementRef) {
    this.refreshInterval = 30;
    this.currentValue = Number(elementRef.nativeElement.innerHTML);
    this.steps = this.duration / this.refreshInterval;
    this.increment = (this.newValue - this.currentValue) / this.steps;

    elementRef.nativeElement.style.color = 'red';
    elementRef.nativeElement.innerHTML = 'hello';
  }

}
