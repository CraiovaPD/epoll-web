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
    JsonLdDirective
  ],
  exports: [
    ToastNotificationsOutletComponent,
    NavbarComponent,
    NavbarLogoButtonComponent,
    JsonLdDirective
  ],
  entryComponents: []
})
export class UtilModule {}
