import { NgModule }  from '@angular/core';

import { SharedModule } from '../../shared.module';
import { UtilModule } from '../../util/util.module';
import { AccountKitService } from './accountKit.service';

@NgModule({
  imports: [
    SharedModule,
    UtilModule
  ],
  providers: [
    AccountKitService
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class UserModule {}
