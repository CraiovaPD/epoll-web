import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Directive used for rendering dynamic components
 * inside a host element.
 *
 * @author Dragos Sebestin
 */
@Directive({
  selector: '[nvb-dynamic-component-host]'
})
export class DynamicComponentHostDirective {

  /**
   * Class constructor.
   */
  constructor (
    public viewRef: ViewContainerRef
  ) {}
}
