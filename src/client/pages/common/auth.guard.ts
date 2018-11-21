import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { LocalStorage } from '../../util/storage/localStorage';
import { JWT_STORAGE_KEY } from '../../core/users/user.service';

/**
 * Service used for protecting authentication routes.
 * Redirects the user to the login page.
 *
 * @author Dragos Sebestin
 */
@Injectable()
export class AuthGuard implements CanActivate {

  /**
   * Class constructor.
   */
  constructor (
    private _localStorage: LocalStorage,
    private _router: Router
  ) { }

  async canActivate (
    route: ActivatedRouteSnapshot
  ) : Promise<boolean> {
    if (!!this._localStorage.getItem(JWT_STORAGE_KEY)) {
      this._localStorage.clear('login-redirect-url');
      return true;
    }

    let nextPath = route.url.join('/') + this._getQueryParams(route.queryParams);
    this._localStorage.setItem('login-redirect-url', nextPath);
    this._router.navigateByUrl('/login');
    return false;
  }

  /**
   * Transform a queryParams object into a url string.
   */
  private _getQueryParams (queryParams: any) : string {
    let str = '?';
    for (let key in queryParams) {
      str += `${key}=${encodeURIComponent(queryParams[key])}&`;
    }
    return str;
  }
}
