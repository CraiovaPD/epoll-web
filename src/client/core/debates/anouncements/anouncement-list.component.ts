import { Component, OnInit, Input } from '@angular/core';
import moment from 'moment';

import { IDebateAnouncementListItem } from '../../../types/debates/IDebate';

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
}
