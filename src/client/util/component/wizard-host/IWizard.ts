import {TemplateRef} from '@angular/core';

import {WizardPageDirective} from './wizard-page.directive';

/**
 * Wizard interface.
 *
 * @author Dragos Sebestin
 */
export interface IWizard {
  pagesContainer: TemplateRef<any>,
  pages: WizardPageDirective[];

  currentPage () : WizardPageDirective;

  /**
   * Go to next page.
   */
  next () : void;

  /**
   * Go to previous page.
   */
  back () : void;

  /**
   * Go to a given page id.
   */
  goToPage (pageId: string, animation: boolean) : void;
}
