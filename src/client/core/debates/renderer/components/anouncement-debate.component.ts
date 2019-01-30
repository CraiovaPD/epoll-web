import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import moment from 'moment';

import { IDebateComponent } from './IDebateComponent';
import { ENVIRONMENT_CONFIG, IEnvironmentConfig } from '../../../../environment.config';

// types
import { IDebate, IAnouncementDebate } from '../../../../types/debates/IDebate';
import { ErrorUtil } from '../../../../util/helpers/errorUtil';
import { IAppState } from '../../../../store/IApp';
import { IUser } from '../../../../types/users/IUser';

const SHARE_HASHTAG = '#CraiovaPD';

/**
 * Component used for rendering an anouncement debate's
 * details.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  templateUrl: 'anouncement-debate.component.html',
  styleUrls: [
    'anouncement-debate.component.css'
  ]
})
export class AnouncementDebateComponent implements IDebateComponent, OnInit {
  public debate$: Observable<IDebate<IAnouncementDebate> | undefined>;
  public user$: Observable<IUser | undefined>; // currently logged in user

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _store: Store<IAppState>,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig
  ) {
    this.user$ = this._store.select(x => x.profile);
    this.debate$ = this._store.select(x => x.activeDebate).filter(x => !!x);
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

  /**
   * Get a string formatted for displaying the time
   * ago at which a debate was created.
   */
  getAgoTime (debate: IDebate<any>) : string {
    return moment(debate.createdAt).fromNow(true);
  }

  /**
   * Encode an URI component.
   */
  encodeWhatsappMessage (debate: IDebate<any>) : string {
    return encodeURIComponent(
`
${debate.title}

${window.location.href}
`
    );
  }

  /**
   * Share page on Facebok.
   */
  facebookShare (debate: IDebate<any>) {
    if (debate) {
      let pageUrl = encodeURIComponent(window.location.href);
      let shareQuote = encodeURIComponent(debate.title);
      let shareTag = encodeURIComponent(SHARE_HASHTAG);
      /* tslint:disable */
      let shareUrl = `https://www.facebook.com/dialog/share?app_id=${this._env.facebook.appId}&display=popup&href=${pageUrl}&quote=${shareQuote}&hashtag=${shareTag}`;
      /* tslint:enable */
      window.open(shareUrl, '', 'height=300,width=600');
    }
  }
}
