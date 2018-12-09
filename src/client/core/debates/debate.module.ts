import { NgModule }  from '@angular/core';

import { SharedModule } from '../../shared.module';
import { UtilModule } from '../../util/util.module';

import { DebateService } from './debate.service';
import { PollListComponent } from './polls/poll-list.component';

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
  ],
  exports: [
    PollListComponent
  ]
})
export class DebateModule {}
