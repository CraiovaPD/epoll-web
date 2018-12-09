import { Component, OnInit, Input } from '@angular/core';

import { IDebatePollListItem } from '../../../types/debates/IDebate';

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

  /**
   * Class constructor.
   */
  constructor () { }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () { }
}
