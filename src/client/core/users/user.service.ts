import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import EPollAPI from 'epoll-api-sdk';

import {IAppState} from '../../store/IApp';
import {
  SetProfile
} from '../../store/users/profile.actions';
import { IUserProfile } from '../../store/users/IUserProfile';
import { LocalStorage } from '../../util/storage/localStorage';
import { IEnvironmentConfig, ENVIRONMENT_CONFIG } from '../../environment.config';
import { IUser } from '../../types/users/IUser';

export const JWT_STORAGE_KEY = '@epoll:jwt';
export const JWT_TYPE_STORAGE_KEY = '@epoll:jwt-type';

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
    private _router: Router,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig,
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
      let user = await EPollAPI.Users().getMyUserProfile().toPromise();
      this.setProfile({
        _id: user._id,
        phone: user.phone,
        firstname: user.firstname,
        lastname: user.lastname
      });
    }
  }

  /**
   * Reset authorization tokens.
   */
  logout () {
    this._localStorage.clear(JWT_STORAGE_KEY);
    this._localStorage.clear(JWT_TYPE_STORAGE_KEY);
    EPollAPI.endSession();
    this._store.dispatch(new SetProfile());
    this._router.navigate(['/login']);
  }

  /**
   * Check if a user is logged in.
   */
  isLoggedIn () : boolean {
    return !!this._localStorage.getItem(JWT_STORAGE_KEY);
  }

  /**
   * Authenticate user using an AK Code.
   */
  async authenticate (akCode: string) {
    let state = String(new Date());
    let loginResp = await EPollAPI.Users().authenticate({
      grantType: 'implicit',
      clientId: this._env.authorization.clientId,
      state,
      accountKitCode: akCode,
    }).toPromise();

    if (loginResp.state === state) {
      // save access credentials in browser storage
      this._localStorage.setItem(JWT_STORAGE_KEY, loginResp.accessToken);
      this._localStorage.setItem(JWT_TYPE_STORAGE_KEY, loginResp.tokenType);

      // init API SDK
      EPollAPI.startSession(loginResp.tokenType, loginResp.accessToken);

      // save user profile in store
      if (loginResp.user)
        this.setProfile(loginResp.user);
    }
  }

  /**
   * Register a new user account.
   */
  async registerNewAccount (params: {
    akCode: string,
    firstname: string,
    lastname: string
  }) {
    let state = String(new Date());
    let loginResp = await EPollAPI.Users().register({
      grantType: 'implicit',
      clientId: this._env.authorization.clientId,
      state,
      accountKitCode: params.akCode,
      firstname: params.firstname,
      lastname: params.lastname
    }).toPromise();

    if (loginResp.state === state) {
      // save access credentials in browser storage
      this._localStorage.setItem(JWT_STORAGE_KEY, loginResp.accessToken);
      this._localStorage.setItem(JWT_TYPE_STORAGE_KEY, loginResp.tokenType);

      // init API SDK
      EPollAPI.startSession(loginResp.tokenType, loginResp.accessToken);
    }
  }

  /**
   * Get a user account by id.
   */
  getUserById (id: string) : Observable<IUser> {
    return EPollAPI.Users().getUserProfileById(id);
  }

  /**
   * Delete user account.
   */
  deleteAccount () : Observable<void> {
    return EPollAPI.Users().deleteAccount();
  }
}
