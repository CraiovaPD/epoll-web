import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
// import EPollAPI from 'epoll-api-sdk';

import {IAppState} from '../../store/IApp';
import {
  SetProfile
} from '../../store/users/profile.actions';
import { IUserProfile } from '../../store/users/IUserProfile';
import { LocalStorage } from '../../util/storage/localStorage';
import { Router } from '@angular/router';

export const JWT_STORAGE_KEY = '@epoll:jwt';

/**
 * Angular user service class.
 *
 * @author Dragos Sebestin
 */
@Injectable()
export class UserService {

  /**
   * Class constructor.
   */
  constructor (
    private _store: Store<IAppState>,
    private _localStorage: LocalStorage,
    private _router: Router
    // @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig,
  ) {}

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () { }

  /**
   * Set user profile.
   */
  setProfile (profile: IUserProfile) {
    this._store.dispatch(new SetProfile(profile));
  }

  /**
   * Get user profile.
   */
  getProfile () : Observable<IUserProfile | undefined> {
    return this._store.select(state => state.profile);
  }

  /**
   * Load user profile from the server and set it in the store.
   */
  async loadProfile () {
    if (this.isLoggedIn()) {
      // let user = await EPollAPI.Users().getProfile().toPromise();
      // this.setProfile({
      //   _id: user._id,
      //   phone: user.phone,
      //   firstname: user.profile.firstname,
      //   lastname: user.profile.lastname,
      //   photo: user.profile.photo,
      //   facebookId: user.facebook ? user.facebook.id : undefined
      // });
    }
  }

  /**
   * Reset authorization tokens.
   */
  logout () {
    this._localStorage.clear(JWT_STORAGE_KEY);
    // .EPollAPI.endSession();
    this._store.dispatch(new SetProfile());
    this._router.navigate(['/login']);
  }

  /**
   * Check if a user is logged in.
   */
  isLoggedIn () : boolean {
    return !!this._localStorage.getItem(JWT_STORAGE_KEY);
  }
}
