import {Component, OnInit, OnDestroy, Inject, PLATFORM_ID} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IAppState } from '../../store/IApp';

// types
import { IDebate } from '../../types/debates/IDebate';
import { UserRole } from '../../types/users/IUser';
import { IEnvironmentConfig, ENVIRONMENT_CONFIG } from '../../environment.config';

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

  public debate: IDebate<any>;
  public isEditor$: Observable<boolean>;

  public SCHEMA = {};
  /**
   * Class constructor.
   */
  constructor (
    private _title: Title,
    private _meta: Meta,
    private _store: Store<IAppState>,
    @Inject(PLATFORM_ID) private _platformId: Object,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig,
    activatedRoute: ActivatedRoute
  ) {
    let data = activatedRoute.snapshot.data.pageData as IPageData;

    this.debate = data.debate;

    this.isEditor$ = this._store.select(
      s => s.profile
    ).pipe(map(profile => {
      if (!profile) return false;

      if (profile._id === this.debate.createdBy) return true;
      return profile.role < UserRole.regular;
    }));

    if (isPlatformServer(this._platformId)) {
      _meta.addTags([{
        property: 'og:title',
        content: this.debate.title
      }, {
        property: 'og:description',
        content: this.debate.content
      }, {
        property: 'og:type',
        content: 'website'
      }, {
        property: 'og:url',
        content: this._getURL()
      }]);
      // {
      //   property: 'og:image',
      //   content: this.page.profilePhoto.large
      // }

      this.SCHEMA = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': this.debate._id,
        'image': [
        ],
        'name': this.debate.title,
        'url': this._getURL()
      };
    }
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
    this._originalTitle = this._title.getTitle();
    this._title.setTitle(this.debate.title);

    let foundTag = this._meta.getTag('description');
    if (foundTag) {
      this._originalDescription = foundTag.content;
    }
    this._meta.updateTag({
      name: 'description', content: this.debate.content
    }, `name='description'`);
  }

  ngOnDestroy () {
    this._title.setTitle(this._originalTitle);
    this._meta.updateTag({
      name: 'description', content: this._originalDescription
    }, `name='description'`);
  }

  /**
   * Get a valid debate page URL.
   */
  private _getURL() {
    if (isPlatformServer(this._platformId))
      return `${this._env.baseUrl}${this.debate._id}`;

    return window.location.href;
  }
}
