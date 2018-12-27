import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import moment from 'moment';

import { IDebateComponent } from './IDebateComponent';
import { ENVIRONMENT_CONFIG, IEnvironmentConfig } from '../../../../environment.config';

// types
import { IDebate, IPollDebate } from '../../../../types/debates/IDebate';
import { ErrorUtil } from '../../../../util/helpers/errorUtil';
import { IAppState } from '../../../../store/IApp';
import { IUser } from '../../../../types/users/IUser';

const SHARE_HASHTAG = '#CraiovaPD';

/**
 * Component used for rendering a poll debate's
 * details.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  templateUrl: 'poll-debate.component.html',
  styleUrls: [
    'poll-debate.component.css'
  ]
})
export class PollDebateComponent implements IDebateComponent, OnInit {
  public vote$ = new Subject<string>();
  public debate: IDebate<IPollDebate> | undefined;
  public user$: Observable<IUser | undefined>; // currently logged in user

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _store: Store<IAppState>,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig,
    private _router: Router
  ) {
    this.user$ = this._store.select(x => x.profile);
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
   * IDebateComponent interface methods.
   */
  setDebate (debate: IDebate<any>): void {
    this.debate = debate;
  }

  /**
   * Get a string formatted for displaying the time
   * ago at which a debate was created.
   */
  getAgoTime (debate: IDebate<any>) : string {
    return moment(debate.createdAt).fromNow(true);
  }

  /**
   * Add a vote on this poll.
   */
  async vote (optionId: string) {
    this.vote$.next(optionId);
  }

  /**
   * Encode an URI component.
   */
  encodeWhatsappMessage (debate: IDebate<any>) : string {
    return encodeURIComponent(
`
${debate.payload.title}

${this._router.url}
`
    );
  }

  /**
   * Share page on Facebok.
   */
  facebookShare (debate: IDebate<any>) {
    if (this.debate) {
      let pageUrl = encodeURIComponent(window.location.href);
      let shareQuote = encodeURIComponent(debate.payload.title);
      let shareTag = encodeURIComponent(SHARE_HASHTAG);
      /* tslint:disable */
      let shareUrl = `https://www.facebook.com/dialog/share?app_id=${this._env.facebook.appId}&display=popup&href=${pageUrl}&quote=${shareQuote}&hashtag=${shareTag}`;
      /* tslint:enable */
      window.open(shareUrl, '', 'height=300,width=600');
    }
  }
}
