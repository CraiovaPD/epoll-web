import { NgModule }  from '@angular/core';

import { SharedModule } from '../../shared.module';
import { UtilModule } from '../../util/util.module';

import { DebateService } from './debate.service';
import { PollListComponent } from './polls/poll-list.component';
import { DebateHostComponent } from './renderer/debate-host.component';

@NgModule({
  imports: [
    SharedModule,
    UtilModule
  ],
  providers: [
    DebateService
  ],
  declarations: [
    PollListComponent,
    DebateHostComponent
  ],
  exports: [
    PollListComponent,
    DebateHostComponent
  ]
})
export class DebateModule {}
