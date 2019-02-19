import {Component, OnInit, OnDestroy, Inject, PLATFORM_ID} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IEnvironmentConfig, ENVIRONMENT_CONFIG } from '../../environment.config';
import { IAppState } from '../../store/IApp';
import { ToastNotificationsService } from '../../util/component/toast-notifications/toast-notifications.service';
import { DebateService } from '../../core/debates/debate.service';
import { ErrorUtil } from '../../util/helpers/errorUtil';
import { UpdateActiveDebateState, SetActiveDebate } from '../../store/debates/activeDebate.actions';

// types
import { IDebate, DebateState } from '../../types/debates/IDebate';
import { UserRole } from '../../types/users/IUser';

export interface IPageData {
  debate: IDebate<any>
}

/**
 * Component used for displaying a public debate.
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
export class DebateDetailsPageComponent implements OnInit, OnDestroy {
  private _originalTitle: string = '';
  private _originalDescription: string = '';

  public debate$: Observable<IDebate<any> | undefined>;
  public isEditor$: Observable<boolean>;
  public isModerator$: Observable<boolean>;

  public SCHEMA = {};
  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _title: Title,
    private _meta: Meta,
    private _store: Store<IAppState>,
    @Inject(PLATFORM_ID) private _platformId: Object,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig,
    private _toasts: ToastNotificationsService,
    private _debateService: DebateService,
    private _activatedRoute: ActivatedRoute
  ) {
    let data = _activatedRoute.snapshot.data.pageData as IPageData;

    let debate = data.debate;
    this._store.dispatch(new SetActiveDebate(data.debate));
    this.debate$ = this._store.select(x => x.activeDebate);

    this.isEditor$ = this._store.select(
      s => s.profile
    ).pipe(map(profile => {
      if (!profile) return false;

      // if (profile._id === debate.createdBy) return true;
      return profile.role < UserRole.regular;
    }));
    this.isModerator$ = this._store.select(
      s => s.profile
    ).pipe(map(profile => {
      if (!profile) return false;

      // if (profile._id === debate.createdBy) return true;
      return profile.role < UserRole.regular;
    }));

    if (isPlatformServer(this._platformId)) {
      _meta.addTags([{
        property: 'og:title',
        content: debate.title
      }, {
        property: 'og:description',
        content: debate.content
      }, {
        property: 'og:type',
        content: 'website'
      }, {
        property: 'og:url',
        content: this._getURL(debate)
      }, {
        property: 'og:image',
        content: this._getLogoURL()
      }]);
      // {
      //   property: 'og:image',
      //   content: this.page.profilePhoto.large
      // }

      this.SCHEMA = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': debate._id,
        'image': this._getLogoURL(),
        'name': debate.title,
        'url': this._getURL(debate)
      };
    }
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
    let data = this._activatedRoute.snapshot.data.pageData as IPageData;
    let debate = data.debate;
    this._originalTitle = this._title.getTitle();
    this._title.setTitle(debate.title);

    let foundTag = this._meta.getTag('description');
    if (foundTag) {
      this._originalDescription = foundTag.content;
    }
    this._meta.updateTag({
      name: 'description', content: debate.content
    }, `name='description'`);
  }

  ngOnDestroy () {
    this._title.setTitle(this._originalTitle);
    this._meta.updateTag({
      name: 'description', content: this._originalDescription
    }, `name='description'`);
  }

  /**
   * Aprove a debate that is in a draft state.
   */
  async approve (debate: IDebate<any>) {
    try {
      await this._debateService.updateDebateState({
        debateId: debate._id,
        newState: DebateState.published
      }).toPromise();

      this._store.dispatch(new UpdateActiveDebateState(DebateState.published));
      this._toasts.addSuccess('Dezbaterea a fost aprobata.');
    } catch (error) {
      this._errors.dispatch(error);
    }
  }

  /**
   * Unpublish a debate that is in published state.
   */
  async unpublish (debate: IDebate<any>) {
    try {
      await this._debateService.updateDebateState({
        debateId: debate._id,
        newState: DebateState.unpublished
      }).toPromise();

      this._store.dispatch(new UpdateActiveDebateState(DebateState.unpublished));
      this._toasts.addSuccess('Dezbaterea este acum privata.');
    } catch (error) {
      this._errors.dispatch(error);
    }
  }

  /**
   * Republish a debate that is in unpublished state.
   */
  async republish (debate: IDebate<any>) {
    try {
      await this._debateService.updateDebateState({
        debateId: debate._id,
        newState: DebateState.published
      }).toPromise();

      this._store.dispatch(new UpdateActiveDebateState(DebateState.published));
      this._toasts.addSuccess('Dezbaterea a fost republicata.');
    } catch (error) {
      this._errors.dispatch(error);
    }
  }

  /**
   * Get a valid debate page URL.
   */
  private _getURL (debate: IDebate<any>) {
    if (isPlatformServer(this._platformId))
      return `${this._env.baseUrl}${debate._id}`;

    return window.location.href;
  }

  /**
   * Get logo URL for meta tags.
   */
  private _getLogoURL () : string {
    return `${this._env.baseUrl}assets/logo-mono.png`;
  }
}
