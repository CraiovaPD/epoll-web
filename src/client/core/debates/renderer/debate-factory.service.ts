import { Injectable, Type } from '@angular/core';

import { PollDebateComponent } from './components/poll-debate.component';
import { IDebateComponent } from './components/IDebateComponent';
import { IDebate, DebateType } from '../../../types/debates/IDebate';
import { AnouncementDebateComponent } from './components/anouncement-debate.component';

/**
 * Class used for instantiating Debate concrete components.
 *
 * @author Dragos Sebestin
 */
@Injectable()
export class DebateFactoryService {

  /**
   * Class constructor.
   */
  constructor () { }

  /**
   * Create a new debate component.
   */
  getComponent (debate: IDebate<any>) : Type<IDebateComponent> {
    switch (debate.type) {
      case DebateType.poll:
        return PollDebateComponent;
      case DebateType.anouncement:
        return AnouncementDebateComponent;
      default:
        return PollDebateComponent;
    }
  }
}
