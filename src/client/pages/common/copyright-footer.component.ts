import { Component, OnInit } from '@angular/core';

/**
 * Component used for rendering a generic footer
 * with copyright information and links to the docs.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  selector: 'epoll-copyright-footer',
  templateUrl: 'copyright-footer.component.html'
})
export class CopyrightFooterComponent implements OnInit {

  /**
   * Class constructor.
   */
  constructor () { }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () { }

  /**
   * Get current year to be displayed in footer.
   */
  getYear () : number {
    return (new Date()).getFullYear();
  }
}
