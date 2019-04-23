import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ENVIRONMENT_CONFIG, IEnvironmentConfig } from '../../environment.config';
import { IAppState } from '../../store/IApp';
import { ErrorUtil } from '../../util/helpers/errorUtil';
import { DebateService } from '../../core/debates/debate.service';

// types
import { IDebatePollListItem, DebateState, IDebateAnouncementListItem } from '../../types/debates/IDebate';
import { UserRole } from '../../types/users/IUser';
import { Title, Meta } from '@angular/platform-browser';

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
  public SCHEMA = {};
  public polls$: Observable<IDebatePollListItem[]>;
  public anouncements$: Observable<IDebateAnouncementListItem[]>;
  public isAdmin$: Observable<boolean>;

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _store: Store<IAppState>,
    private _debateService: DebateService,
    @Inject(PLATFORM_ID) private _platformId: Object,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig,
    private _title: Title,
    private _meta: Meta
  ) {
    this.isAdmin$ = this._store.select(s => s.profile)
    .pipe(map(profile => {
      return profile ? profile.role < UserRole.regular : false;
    }));

    this.polls$ = this.isAdmin$.pipe(switchMap(isAdmin => this._debateService.listPolls({
      state: {
        from: isAdmin ? DebateState.draft : DebateState.published,
        to: isAdmin ? DebateState.unpublished : DebateState.published
      },
      limit: 5
    })));
    this.anouncements$ = this.isAdmin$.pipe(switchMap(isAdmin => this._debateService.listAnouncements({
      state: {
        from: isAdmin ? DebateState.draft : DebateState.published,
        to: isAdmin ? DebateState.unpublished : DebateState.published
      },
      limit: 5
    })));
  }

  /**
   * Angular lifecycle hooks
   */
  async ngOnInit () {
    try {
      if (isPlatformServer(this._platformId)) {
        let descriptionTag = this._meta.getTag('description');
        this._meta.addTags([{
          property: 'og:title',
          content: this._title.getTitle()
        }, {
          property: 'og:description',
          content: descriptionTag ? descriptionTag.content : 'Ţinem cont de vocea cetăţenilor din Craiova'
        }, {
          property: 'og:type',
          content: 'website'
        }, {
          property: 'og:url',
          content: this._env.baseUrl
        }, {
          property: 'og:image',
          content: this._getLogoURL()
        }]);

        this.SCHEMA = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'image': this._getLogoURL(),
          'name': this._title.getTitle(),
          'url': this._env.baseUrl
        };
      }
    } catch (err) {
      this._errors.dispatch(err);
    }
  }

  ngOnDestroy () {
  }

  /**
   * Get logo URL for meta tags.
   */
  private _getLogoURL () : string {
    return `${this._env.baseUrl}assets/logo-mono.png`;
  }
}
