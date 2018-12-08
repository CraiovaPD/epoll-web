import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';

import { UserModule } from './users/user.module';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    UserModule,
  ]
})
export class CoreModule {}
