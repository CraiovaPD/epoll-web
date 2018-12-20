import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// types
import { IUser } from '../../types/users/IUser';
import { UserService } from '../../core/users/user.service';
import { ErrorUtil } from '../../util/helpers/errorUtil';

export interface IPageData {
  user: IUser
}

export interface IBadge {
  // _id: string,
  name: string,
  description: string,
  icon: string
}

/**
 * Component used for displaying the user profile page.
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
export class UserProfilePageComponent implements OnInit {
  private _pageData: IPageData;

  public user: IUser;
  public deleteAgreement = false;
  public badges: IBadge[] = [{
    name: 'Primul sondaj',
    description: 'Ai creat primul tau sondaj.',
    icon: ''
  }, {
    name: 'Primul sondaj',
    description: 'Ai creat primul tau sondaj.',
    icon: ''
  }, {
    name: 'Primul sondaj',
    description: 'Ai creat primul tau sondaj.',
    icon: ''
  }, {
    name: 'Primul sondaj',
    description: 'Ai creat primul tau sondaj.',
    icon: ''
  }, {
    name: 'Primul sondaj',
    description: 'Ai creat primul tau sondaj.',
    icon: ''
  }];

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _activeRoute: ActivatedRoute,
    private _userService: UserService,
    private _router: Router
  ) {
    this._pageData = _activeRoute.snapshot.data.pageData;
    this.user = this._pageData.user;
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {}

  /**
   * Check if the current user is viewing his own profile.
   */
  isOwnProfile () : boolean {
    let userId = this._activeRoute.snapshot.params['id'];
    return this.user._id === userId;
  }

  /**
   * Log user out.
   */
  logout () {
    try {
      this._userService.logout();
      this._router.navigate(['/login']);
    } catch (error) {
      this._errors.dispatch(error);
    }
  }

  /**
   * Delete user account.
   */
  async deleteAccount () {
    try {
      if (confirm('Esti sigur ca vrei sa stergi definitiv contul?')) {
        await this._userService.deleteAccount();
        this._router.navigate(['/login']);
      }
    } catch (error) {
      this._errors.dispatch(error);
    }
  }
}
