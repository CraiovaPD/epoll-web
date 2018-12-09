import { NgModule } from '@angular/core';

import { SharedModule } from '../shared.module';

import { UserModule } from './users/user.module';
import { DebateModule } from './debates/debate.module';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    UserModule,
    DebateModule
  ]
})
export class CoreModule {}
