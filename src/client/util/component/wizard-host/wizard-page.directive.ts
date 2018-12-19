import {Directive, Input, ElementRef, OnInit} from '@angular/core';
import {AnimationBuilder, AnimationAnimateRefMetadata} from '@angular/animations';

import {IWizardPage} from './IWizardPage';

/**
 * Directive used for annotating wizard pages.
 * Used by the host to inject pages into concrete components.
 *
 * @author Dragos Sebestin
 */
@Directive({
  selector: 'nvb-wizard-page'
})
export class WizardPageDirective implements IWizardPage, OnInit {
  private _isHidden = false;

  @Input() public title: string = '';
  @Input('pageId') public pageId: string = '';

  /**
   * Class constructor.
   */
  constructor (
    private _elementRef: ElementRef,
    private _animationBuilder: AnimationBuilder
  ) { }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
    // needed for animations to work
    let element = this._elementRef.nativeElement as HTMLElement;
    element.style.display = 'block';
  }

  /**
   * IWizardPage interface methods.
   */
  hide (animation?: AnimationAnimateRefMetadata) {
    if (!this._isHidden) {
      let element = this._elementRef.nativeElement as HTMLElement;

      if (animation) {
        let factory = this._animationBuilder.build(animation);
        let player = factory.create(this._elementRef.nativeElement);
        player.play();
      }

      element.hidden = true;
      this._isHidden = true;
    }
  }

  show (animation?: AnimationAnimateRefMetadata) {
    if (this._isHidden) {
      let element = this._elementRef.nativeElement as HTMLElement;
      element.hidden = false;
      this._isHidden = false;

      if (animation) {
        let factory = this._animationBuilder.build(animation);
        let player = factory.create(this._elementRef.nativeElement);
        player.play();
      }
    }
  }

  isHidden () : boolean {
    return this._isHidden;
  }
}
