import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';

import { IPageData } from './page.component';
import { DebateService } from '../../core/debates/debate.service';
import { ErrorUtil } from '../../util/helpers/errorUtil';
import { IDebate } from '../../types/debates/IDebate';

const DEBATE_KEY = makeStateKey<IDebate<any>>('DEBATE');

@Injectable()
export class DebatePageResolver implements Resolve<IPageData | undefined> {

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _router: Router,
    private _debates: DebateService,
    private _transferState: TransferState,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {}

  async resolve (routeSnapshot: ActivatedRouteSnapshot) {
    try {
      let debateId = routeSnapshot.params['id'];

      if (isPlatformBrowser(this._platformId) && this._transferState.hasKey(DEBATE_KEY)) {
        let found = this._transferState.get<IDebate<any> | undefined>(DEBATE_KEY, undefined);
        this._transferState.remove(DEBATE_KEY);

        return {
          debate: found as IDebate<any>
        };
      } else {
        let debate = await this._debates.getDebateById(debateId).toPromise();

        if (isPlatformServer(this._platformId))
          this._transferState.set(DEBATE_KEY, debate);

        return {
          debate
        };
      }

    } catch (error) {
      this._errors.dispatch(error);
      this._router.navigateByUrl('404');
      throw error;
    }
  }
}
