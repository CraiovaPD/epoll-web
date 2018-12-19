import { Component, OnInit, Input } from '@angular/core';
import { WizardHostComponent } from '../wizard-host.component';
import { IWizardPage } from '../IWizardPage';

/**
 * Component used for rendering bullets
 * reflecting which page is selected.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  selector: 'nvb-wizard-bullet-outlet',
  templateUrl: 'bullet-outlet.component.html',
  styleUrls: [
    'bullet-outlet.component.css'
  ]
})
export class WizardBulletOutletComponent implements OnInit {
  @Input('wizardHost') wizardHost: WizardHostComponent = undefined as any;

  /**
   * Class constructor.
   */
  constructor () { }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () { }

  /**
   * Check if a page is the current selected one.
   */
  isSelected (page: IWizardPage) : boolean {
    if (!this.wizardHost.wizard) return false;

    let currentPage = this.wizardHost.wizard.currentPage();
    return currentPage.pageId === page.pageId;
  }

  /**
   * Move to selected item
   * @param page
   */
  goTo (page: IWizardPage): void {
    this.wizardHost.goToPage(page.pageId);
  }
}
