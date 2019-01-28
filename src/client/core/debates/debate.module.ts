import { NgModule }  from '@angular/core';

import { SharedModule } from '../../shared.module';
import { UtilModule } from '../../util/util.module';

import { DebateService } from './debate.service';
import { PollListComponent } from './polls/poll-list.component';
import { DebateHostComponent } from './renderer/debate-host.component';
import { PollDebateComponent } from './renderer/components/poll-debate.component';
import { DebateDirective } from './renderer/debate.directive';
import { DebateFactoryService } from './renderer/debate-factory.service';
import { PollVoteComponent } from './renderer/components/poll-vote.component';
import { AnouncementListComponent } from './anouncements/anouncement-list.component';
import { AnouncementDebateComponent } from './renderer/components/anouncement-debate.component';

@NgModule({
  imports: [
    SharedModule,
    UtilModule
  ],
  providers: [
    DebateService,
    DebateFactoryService
  ],
  declarations: [
    PollListComponent,
    DebateHostComponent,
    PollDebateComponent,
    DebateDirective,
    PollVoteComponent,
    AnouncementListComponent,
    AnouncementDebateComponent
  ],
  exports: [
    PollListComponent,
    DebateHostComponent,
    AnouncementListComponent
  ],
  entryComponents: [
    PollDebateComponent,
    AnouncementDebateComponent
  ]
})
export class DebateModule {}
