import { Component, OnInit, OnDestroy } from '@angular/core';

import { ErrorUtil } from '../../util/helpers/errorUtil';

/**
 * Component used for displaying the home page.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  templateUrl: 'page.component.html',
  styleUrls: [
    'page.component.css'
  ]
})
export class HomePageComponent implements OnInit, OnDestroy {

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil
  ) {

  }

  /**
   * Angular lifecycle hooks
   */
  async ngOnInit () {
    try {

    } catch (err) {
      this._errors.dispatch(err);
    }
  }

  ngOnDestroy () {
  }
}
