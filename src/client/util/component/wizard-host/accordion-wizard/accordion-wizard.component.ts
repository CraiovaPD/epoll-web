import {
  Component, TemplateRef, Input, AfterContentInit
} from '@angular/core';
import {useAnimation} from '@angular/animations';

import {slideInVertically} from '../../../animations/slideInVertically';
import {IWizard} from '../IWizard';
import {WizardPageDirective} from '../wizard-page.directive';

export const WIZARD_TYPE = 'nvb:wizard:accordion';

/**
 * Component used for rendering an accordion style wizard.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  templateUrl: 'accordion-wizard.component.html',
  styleUrls: ['accordion-wizard.component.css']
})
export class AccordionWizardComponent implements IWizard, AfterContentInit {
  private _currentPageIndex: number = 0;

  @Input() pagesContainer: TemplateRef<any>;
  @Input() pages: WizardPageDirective[] = [];

  /**
   * Class constructor.
   */
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
    return this.pages[this._currentPageIndex];
  }

  next () : void {
    let nextIndex = this._currentPageIndex + 1;
    if (nextIndex < this.pages.length) {
      let nextPage = this.pages[nextIndex];
      nextPage.show();
      this._currentPageIndex = nextIndex;
    }
  }

  back () : void {

  }

  goToPage (pageId: string) : void {
    let pageIndex = this.pages.findIndex(
      page => page.pageId === pageId
    );

    if (pageIndex !== -1) {
      let nextPage = this.pages[pageIndex];
      nextPage.show(useAnimation(slideInVertically({time: '500ms', translatePercent: '100%'})));
      this._currentPageIndex = pageIndex;
    }
  }
}
