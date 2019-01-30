import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import moment from 'moment';

import { IDebateComponent } from './IDebateComponent';
import { ENVIRONMENT_CONFIG, IEnvironmentConfig } from '../../../../environment.config';
import { DebateService } from '../../debate.service';

// types
import { IDebate, IPollDebate } from '../../../../types/debates/IDebate';
import { ErrorUtil } from '../../../../util/helpers/errorUtil';
import { IAppState } from '../../../../store/IApp';
import { IUser } from '../../../../types/users/IUser';
import { AddVoteToActiveDebate } from '../../../../store/debates/activeDebate.actions';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollDebateComponent implements IDebateComponent, OnInit {
  public vote$ = new Subject<string>();
  public debate$: Observable<IDebate<IPollDebate> | undefined>;
  public user$: Observable<IUser | undefined>; // currently logged in user

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _store: Store<IAppState>,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig,
    private _debates: DebateService
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
   * Add a vote on this poll.
   */
  async vote (optionId: string) {
    try {
      await this._countVote(optionId);
    } catch (error) {
      this._errors.dispatch(error);
    }
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

  /**
   * Add a new vote to the debate.
   */
  private async _countVote (optionId: string) {
    let debate = await this.debate$.pipe(take(1)).toPromise();
    if (!debate) return;

    let newVote = await this._debates.voteOnPoll({
      pollId: debate._id,
      selectedOptionId: optionId
    }).toPromise();

    this._store.dispatch(new AddVoteToActiveDebate(newVote));
  }
}
