import {Injectable, Type} from '@angular/core';

import {IWizard} from './IWizard';

// wizard components
import {
  AccordionWizardComponent,
  WIZARD_TYPE as ACCORDION_TYPE
} from './accordion-wizard/accordion-wizard.component';
import {
  CarouselWizardComponent,
  WIZARD_TYPE as CAROUSEL_TYPE
} from './carousel-wizard/carousel-wizard.component';

/**
 * Factory class used for instantiating concrete IWizard components.
 *
 * @author Dragos Sebestin
 */
@Injectable()
export class WizardFactory {
  private _registeredComponents = new Map<string, Type<IWizard>>();

  /**
   * Class constructor.
   */
  constructor () {
    // register components
    this.register(ACCORDION_TYPE, AccordionWizardComponent);
    this.register(CAROUSEL_TYPE, CarouselWizardComponent);
  }

  /**
   * Get wizard component.
   */
  getComponent (type: string) : Type<IWizard> {
    let comp = this._registeredComponents.get(type);
    if (comp)
      return comp;

    // default to carousel mode
    return CarouselWizardComponent;
  }

  /**
   * Register a new wizard type component.
   */
  private register (type: string, wizard: Type<IWizard>) {
    this._registeredComponents.set(
      type, wizard
    );
  }
}
