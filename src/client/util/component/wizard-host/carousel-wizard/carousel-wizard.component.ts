import {Component, TemplateRef, Input, AfterContentInit} from '@angular/core';
import {useAnimation} from '@angular/animations';

import {IWizard} from '../IWizard';
import {WizardPageDirective} from '../wizard-page.directive';
import {slideInFromSide} from '../../../animations/slideInFromSide';

export const WIZARD_TYPE = 'nvb:wizard:carousel';

/**
 * Component used for rendering a carousel style wizard.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  templateUrl: 'carousel-wizard.component.html'
})
export class CarouselWizardComponent implements IWizard, AfterContentInit {
  private _showNextAnimation = useAnimation(slideInFromSide());
  private _showPreviousAnimation = useAnimation(slideInFromSide({translatePercent: '-50%'}));

  @Input() pagesContainer: TemplateRef<any>;
  @Input() pages: WizardPageDirective[] = [];

  public currentPageIndex: number = 0;

  constructor () {
    this.pagesContainer = {} as any;
  }

  /**
   * Angular lifecycle hooks.
   */
  ngAfterContentInit () {
    this.pages.forEach(page => page.hide());

    // display first page if it exists
    let firstPage = this.pages[0];
    if (firstPage)
      firstPage.show();
  }

  /**
   * IWizard interface methods.
   */
  currentPage () : WizardPageDirective {
    return this.pages[this.currentPageIndex];
  }

  next () : void {
    let nextIndex = this.currentPageIndex + 1;
    if (nextIndex < this.pages.length) {
      // hide current page
      let currentPage = this.pages[this.currentPageIndex];
      currentPage.hide();

      // show next page
      let nextPage = this.pages[nextIndex];
      nextPage.show(useAnimation(this._showNextAnimation));

      // save page index
      this.currentPageIndex = nextIndex;
    }
  }

  back () : void {
    let prevIndex = this.currentPageIndex - 1;
    if (prevIndex >= 0 && prevIndex < this.pages.length) {
      // hide current page
      let currentPage = this.pages[this.currentPageIndex];
      currentPage.hide();

      // show previous page
      let prevPage = this.pages[prevIndex];
      prevPage.show(this._showPreviousAnimation);

      // save page index
      this.currentPageIndex = prevIndex;
    }
  }

  goToPage (pageId: string, animation: boolean) : void {
    let pageIndex = this.pages.findIndex(
      page => page.pageId === pageId
    );

    if (pageIndex !== -1) {
      // hide current page
      let currentPage = this.pages[this.currentPageIndex];
      currentPage.hide();

      // show next page
      let nextPage = this.pages[pageIndex];

      let showAnimation;

      if (animation) {
        showAnimation = pageIndex < this.currentPageIndex ? this._showPreviousAnimation : this._showNextAnimation;
      }

      nextPage.show(showAnimation);

      // save page index
      this.currentPageIndex = pageIndex;
    }
  }

  /**
   * Get pages count.
   */
  getPageCount () : number {
    return this.pages.length;
  }

  /**
   * Get current page title.
   */
  getCurrentPageTitle () : string {
    return this.pages[this.currentPageIndex].title;
  }
}
