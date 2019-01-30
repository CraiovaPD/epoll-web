import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';
import { LocalStorage } from './storage/localStorage';

import { ErrorUtil } from './helpers/errorUtil';
import {
  ToastNotificationsOutletComponent
} from './component/toast-notifications/toast-notifications-outlet.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { NavbarLogoButtonComponent } from './component/navbar/navbar-logo-button.component';
import { JsonLdDirective } from './component/json-ld.directive';
import { DynamicComponentHostDirective } from './component/dynamic-component-host.directive';
import { FilePickerDirective } from './component/file-picker.directive';
import { NavbarUserMenuComponent } from './component/navbar/navbar-user-menu.component';

import { WizardHostComponent } from './component/wizard-host/wizard-host.component';
import { WizardPageDirective } from './component/wizard-host/wizard-page.directive';
import { CarouselWizardComponent } from './component/wizard-host/carousel-wizard/carousel-wizard.component';
import { AccordionWizardComponent } from './component/wizard-host/accordion-wizard/accordion-wizard.component';
import { WizardBulletOutletComponent } from './component/wizard-host/bullet-outlet/bullet-outlet.component';
import { InfiniteScrollDirective } from './component/infinite-scroll.directive';

@NgModule({
  imports: [
    SharedModule
  ],
  providers: [
    LocalStorage,
    ErrorUtil
  ],
  declarations: [
    ToastNotificationsOutletComponent,
    NavbarComponent,
    NavbarLogoButtonComponent,
    NavbarUserMenuComponent,
    JsonLdDirective,
    DynamicComponentHostDirective,
    FilePickerDirective,
    InfiniteScrollDirective,

    // wizard
    WizardHostComponent,
    WizardPageDirective,
    CarouselWizardComponent,
    AccordionWizardComponent,
    WizardBulletOutletComponent,
  ],
  exports: [
    ToastNotificationsOutletComponent,
    NavbarComponent,
    NavbarLogoButtonComponent,
    NavbarUserMenuComponent,
    JsonLdDirective,
    DynamicComponentHostDirective,
    FilePickerDirective,
    InfiniteScrollDirective,

    // wizard
    WizardHostComponent,
    WizardPageDirective,
    WizardBulletOutletComponent,
  ],
  entryComponents: []
})
export class UtilModule {}
