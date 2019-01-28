import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { IAppState } from '../../store/IApp';
import { ErrorUtil } from '../../util/helpers/errorUtil';
import { DebateService } from '../../core/debates/debate.service';

// types
import { IDebatePollListItem, DebateState, IDebateAnouncementListItem } from '../../types/debates/IDebate';
import { UserRole } from '../../types/users/IUser';

/**
 * Component used for displaying the home page.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  templateUrl: 'page.component.html',
  styleUrls: [
    'page.component.css'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit, OnDestroy {
  public polls$: Observable<IDebatePollListItem[]>;
  public anouncements$: Observable<IDebateAnouncementListItem[]>;
  public isAdmin$: Observable<boolean>;

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _store: Store<IAppState>,
    private _debateService: DebateService
  ) {
    this.isAdmin$ = this._store.select(s => s.profile)
    .pipe(map(profile => {
      return profile ? profile.role < UserRole.regular : false;
    }));

    this.polls$ = this.isAdmin$.pipe(switchMap(isAdmin => this._debateService.listPolls({
      state: {
        from: isAdmin ? DebateState.draft : DebateState.published,
        to: DebateState.unpublished
      },
      limit: 5
    })));
    this.anouncements$ = this.isAdmin$.pipe(switchMap(isAdmin => this._debateService.listAnouncements({
      state: {
        from: isAdmin ? DebateState.draft : DebateState.published,
        to: DebateState.unpublished
      },
      limit: 5
    })));
  }

  /**
   * Angular lifecycle hooks
   */
  async ngOnInit () {
    try {

    } catch (err) {
      this._errors.dispatch(err);
    }
  }

  ngOnDestroy () {
  }
}
