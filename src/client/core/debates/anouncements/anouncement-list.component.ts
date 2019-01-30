import { Component, OnInit, Input } from '@angular/core';
import moment from 'moment';

import { IDebateAnouncementListItem, DebateState } from '../../../types/debates/IDebate';

/**
 * Component used for rendering a list of anouncements.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  selector: 'epoll-anouncement-list',
  templateUrl: 'anouncement-list.component.html',
  styleUrls: [
    'anouncement-list.component.css'
  ]
})
export class AnouncementListComponent implements OnInit {
  @Input() anouncements: IDebateAnouncementListItem[] = [];
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
   * Get day from date.
   */
  getDayFromDate (date: Date) : string {
    return moment.utc(date).format('DD');
  }

  /**
   * Get month label from date.
   */
  getMonthFromDate (date: Date) : string {
    return moment.utc(date).format('MMM');
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
