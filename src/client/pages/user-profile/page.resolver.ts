import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';

// types
import { ErrorUtil } from '../../util/helpers/errorUtil';
import { UserService } from '../../core/users/user.service';
import { IPageData } from './page.component';

@Injectable()
export class UserProfilePageResolver implements Resolve<IPageData> {

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _router: Router,
    private _users: UserService
  ) {}

  async resolve (routeSnapshot: ActivatedRouteSnapshot) {
    try {
      let userId = routeSnapshot.params['id'];
      let profile = await this._users.getUserById(userId).toPromise();
      return {
        user: profile
      };
    } catch (error) {
      this._errors.dispatch(error);
      this._router.navigateByUrl('404');
      throw error;
    }
  }
}
