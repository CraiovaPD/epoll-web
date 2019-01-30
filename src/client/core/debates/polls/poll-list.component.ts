import { Component, OnInit, Input } from '@angular/core';

import { IDebatePollListItem, DebateState } from '../../../types/debates/IDebate';

/**
 * Component used for rendering a list of polls.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  selector: 'epoll-poll-list',
  templateUrl: 'poll-list.component.html',
  styleUrls: [
    'poll-list.component.css'
  ]
})
export class PollListComponent implements OnInit {
  @Input() polls: IDebatePollListItem[] = [];
  @Input() showState: boolean = false;

  /**
   * Class constructor.
   */
  constructor () { }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
  }

  /**
   * Get debate state human readable label from date.
   */
  getStateLabel (state: DebateState) : string {
    switch (state) {
      case DebateState.draft:
        return 'draft';
      case DebateState.published:
        return 'public';
      case DebateState.unpublished:
        return 'privat';

      default:
        return 'nu stim ce e';
    }
  }
}
