import { Component, OnInit } from '@angular/core';

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

  /**
   * Class constructor
   */
  constructor () { }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () { }
}
