import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { ErrorUtil } from '../../util/helpers/errorUtil';
import { IAppState } from '../../store/IApp';
import { take } from 'rxjs/operators';
import { UserRole } from '../../types/users/IUser';

/**
 * Service used for protecting role based routes.
 * Redirects the user to the 404 page.
 *
 * @author Dragos Sebestin
 */
@Injectable()
export class UserRoleGuard implements CanActivate {

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _store: Store<IAppState>,
    private _router: Router
  ) { }

  async canActivate (
    route: ActivatedRouteSnapshot
  ) : Promise<boolean> {
    try {
      let profile = await this._store.select(
        s => s.profile
      ).pipe(take(1)).toPromise();
      if (!profile) {
        this._router.navigateByUrl('/404');
        return false;
      }

      let requiredRoles = route.data['roles'] as UserRole[];
      let loggedInUser = profile;
      let hasAccess = requiredRoles.some(
        reqRole => reqRole === loggedInUser.role
      );

      if (!hasAccess) {
        this._router.navigateByUrl('/404');
        return false;
      }

      return true;
    } catch (error) {
      this._errors.dispatch(error);
    }

    return false;
  }
}
