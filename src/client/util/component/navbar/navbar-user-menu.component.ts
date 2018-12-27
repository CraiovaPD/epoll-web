import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

// types
import { IAppState } from '../../../store/IApp';
import { ErrorUtil } from '../../helpers/errorUtil';
import { IUserProfile } from '../../../store/users/IUserProfile';

/**
 * Component used for rendering a user menu item
 * with navbar support in mind.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  selector: 'epoll-navbar-user-menu',
  templateUrl: 'navbar-user-menu.component.html',
  styleUrls: [
    'navbar-user-menu.component.css'
  ]
})
export class NavbarUserMenuComponent implements OnInit {
  public userProfile$: Observable<IUserProfile | undefined>;

  /**
   * Class constructor.
   */
  constructor (
    private _store: Store<IAppState>,
    private _errors: ErrorUtil
  ) {
    this.userProfile$ = this._store.select(s => s.profile);
  }

  /**
   * Angular lifecycle hooks.
   */
  async ngOnInit () {
    try {

    } catch (error) {
      this._errors.dispatch(error);
    }
  }
}
