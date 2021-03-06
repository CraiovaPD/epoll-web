import { Component, OnInit, Input } from '@angular/core';
import { IDebate } from '../../../types/debates/IDebate';

/**
 * Host component used to render a concrete debate item.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  selector: 'epoll-debate-host',
  templateUrl: 'debate-host.component.html',
  styleUrls: [
    'debate-host.component.css'
  ]
})
export class DebateHostComponent implements OnInit {
  @Input() public debate: IDebate<any> | undefined;

  /**
   * Class constructor
   */
  constructor () { }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {

  }
}
