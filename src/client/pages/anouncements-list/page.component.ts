import {Component, OnInit, OnDestroy} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap, startWith, scan, flatMap, take } from 'rxjs/operators';

import { IAppState } from '../../store/IApp';
import { ErrorUtil } from '../../util/helpers/errorUtil';
import { DebateService } from '../../core/debates/debate.service';

// types
import { DebateState, IDebateAnouncementListItem, IDebate, IAnouncementDebate } from '../../types/debates/IDebate';
import { UserRole } from '../../types/users/IUser';

/**
 * Component used for rendering the anouncement list page.
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
export class AnouncementsListPageComponent implements OnInit, OnDestroy {
  public anouncements$: Observable<IDebateAnouncementListItem[]>;
  public isEditor$: Observable<boolean>;

  private _loadStream$ = new BehaviorSubject<number>(0);
  private _cursor = ''; // id of the last anoucement
  private _canLoadMore = true;
  private _fromState = DebateState.published;
  private _toState = DebateState.published;

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _store: Store<IAppState>,
    private _debates: DebateService
  ) {
    this.isEditor$ = this._store.select(
      s => s.profile
    ).pipe(map(profile => {
      if (!profile) return false;

      return profile.role <= UserRole.moderator;
    }));

    this.anouncements$ = this._loadStream$
      .pipe(switchMap(() => {
        return this._debates.listAnouncements({
          fromId: this._cursor,
          state: {
            from: this._fromState,
            to: this._toState,
          },
          limit: 10
        });
      }))
      .pipe(startWith([]))
      .pipe(flatMap(newBatch => {
        if (newBatch.length > 0) {
          this._cursor = newBatch[newBatch.length - 1]._id;
          this._canLoadMore = true;
        }

        return newBatch;
      }))
      .pipe(scan<IDebateAnouncementListItem, IDebateAnouncementListItem[]>( (acc, crt) => acc.concat(crt), [] ));
    // types are explicitly mentioned above because of some weird bug in rxjs
    // https://github.com/ReactiveX/rxjs/issues/4086
  }

  /**
   * Angular lifecycle hooks.
   */
  async ngOnInit () {
    try {
      // if the user is an admin, display all anouncements
      // regardless of status
      let userProfile = await this._store.select(x => x.profile)
        .pipe(take(1)).toPromise();
      if (userProfile && userProfile.role <= UserRole.moderator) {
        this._fromState = DebateState.draft;
        this._toState = DebateState.unpublished;
      }

    } catch (error) {
      this._errors.dispatch(error);
    }
  }

  ngOnDestroy () {
  }

  /**
   * Load next batch of anouncements.
   */
  loadMore () {
    if (this._canLoadMore) {
      this._canLoadMore = false;
      this._loadStream$.next(0);
    }
  }

  /**
   * Aprove a poll that is in a draft state.
   */
  async aprove (debate: IDebate<IAnouncementDebate>) {
    try {
      await this._debates.updateDebateState({
        debateId: debate._id,
        newState: DebateState.published
      }).toPromise();

    } catch (error) {
      this._errors.dispatch(error);
    }
  }
}
