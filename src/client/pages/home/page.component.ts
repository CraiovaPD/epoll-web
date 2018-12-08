import { Component, OnInit, OnDestroy } from '@angular/core';

import { ErrorUtil } from '../../util/helpers/errorUtil';
import { AccountKitService } from '../../core/users/accountKit.service';

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
    private _errors: ErrorUtil,
    private _akService: AccountKitService
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

  /**
   * Login via AK.
   */
  async loginAK () {
    try {
      let token = await this._akService.login('', '');
      console.log(token);
    } catch (err) {
      this._errors.dispatch(err);
    }
  }
}
