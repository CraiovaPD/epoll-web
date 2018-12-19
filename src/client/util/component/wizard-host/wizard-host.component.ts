import {
  Component, ViewChild, AfterContentInit, Input,
  ComponentFactoryResolver, TemplateRef,
  ContentChildren, QueryList
} from '@angular/core';

import { DynamicComponentHostDirective } from '../dynamic-component-host.directive';
import { WizardFactory } from './wizard-factory.service';
import { WizardPageDirective } from './wizard-page.directive';
import { IWizard } from './IWizard';

// wizard types
import { AccordionWizardComponent } from './accordion-wizard/accordion-wizard.component';
import { CarouselWizardComponent } from './carousel-wizard/carousel-wizard.component';

@Component({
  moduleId: module.id,
  selector: 'nvb-wizard-host',
  templateUrl: 'wizard-host.component.html',
  styleUrls: ['wizard-host.component.css'],
  providers: [WizardFactory],
  entryComponents: [
    AccordionWizardComponent,
    CarouselWizardComponent
  ]
})
export class WizardHostComponent implements AfterContentInit {
  @ViewChild(DynamicComponentHostDirective) private _host?: DynamicComponentHostDirective;
  @ViewChild('pagesContainer') private _template?: TemplateRef<any>;
  @ContentChildren(WizardPageDirective) private _pages?: QueryList<WizardPageDirective>;
  @Input('type') private _type: string = '';

  public wizard?: IWizard;

  /**
   * Class constructor.
   */
  constructor (
    private _wizardFactory: WizardFactory,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) {}

  /**
   * Angular lifecycle hooks.
   */
  ngAfterContentInit () {
    if (!this._host || !this._template || !this._pages)
      return;

    let wizardComponent = this._wizardFactory.getComponent(this._type);
    let componentFactory = this._componentFactoryResolver
      .resolveComponentFactory(wizardComponent);

    let component = this._host.viewRef.createComponent(componentFactory);
    component.instance.pagesContainer = this._template;
    component.instance.pages = this._pages.toArray();

    this.wizard = component.instance;
  }

  /**
   * Go to a page by id.
   */
  goToPage (id: string, animation: boolean = true) {
    if (this.wizard) {
      this.wizard.goToPage(id, animation);
    }
  }

  /**
   * Go to next page.
   */
  next () {
    if (this.wizard) {
      this.wizard.next();
    }
  }

  /**
   * Go to previous page.
   */
  back () {
    if (this.wizard) {
      this.wizard.back();
    }
  }
}
