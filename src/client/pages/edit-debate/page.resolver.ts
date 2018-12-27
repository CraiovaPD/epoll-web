import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { IPageData } from './page.component';
import { DebateService } from '../../core/debates/debate.service';
import { ErrorUtil } from '../../util/helpers/errorUtil';

@Injectable()
export class EditDebatePageResolver implements Resolve<IPageData> {

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _router: Router,
    private _debates: DebateService
  ) {}

  async resolve (routeSnapshot: ActivatedRouteSnapshot) {
    try {
      let debateId = routeSnapshot.params['id'];
      let debate = await this._debates.getPollById(debateId).toPromise();

      return {
        debate
      };
    } catch (error) {
      this._errors.dispatch(error);
      this._router.navigateByUrl('404');
      throw error;
    }
  }
}
