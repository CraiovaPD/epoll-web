import { Injectable, Type } from '@angular/core';

import { PollDebateComponent } from './components/poll-debate.component';
import { IDebateComponent } from './components/IDebateComponent';
import { IDebate } from '../../../types/debates/IDebate';

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
  getComponent (type: IDebate<any>) : Type<IDebateComponent> {
    switch (type) {
      default:
        return PollDebateComponent;
    }
  }
}
