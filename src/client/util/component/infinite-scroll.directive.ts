import {Directive, ElementRef, Output, EventEmitter} from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, filter } from 'rxjs/operators';

/**
 * Directive that emits an event when the window's scroll position
 * is near the bottom.
 *
 * @author Dragos Sebestin
 */
@Directive({
  selector: '[epoll-infinite-scroll]'
})
export class InfiniteScrollDirective {
  @Output() public scroll = new EventEmitter<void>();

  constructor (
    private _elementRef: ElementRef
  ) {
    fromEvent(window, 'scroll')
      .pipe(map(() => window.scrollY))
      .pipe(debounceTime(30))
      .pipe(filter(current => current >=  this._elementRef.nativeElement.clientHeight - window.innerHeight))
      .subscribe(() => {
        this.scroll.emit();
      });
  }
}
