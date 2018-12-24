import {Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

// types
import { IDebate } from '../../types/debates/IDebate';

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

  /**
   * Class constructor.
   */
  constructor (
    private _title: Title,
    private _meta: Meta,
    activatedRoute: ActivatedRoute
  ) {
    let data = activatedRoute.snapshot.data.pageData as IPageData;

    this.debate = data.debate;
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
    this._originalTitle = this._title.getTitle();
    this._title.setTitle(this.debate.payload.title);

    let foundTag = this._meta.getTag('description');
    if (foundTag) {
      this._originalDescription = foundTag.content;
    }
    this._meta.updateTag({
      name: 'description', content: this.debate.payload.content
    }, `name='description'`);
  }

  ngOnDestroy () {
    this._title.setTitle(this._originalTitle);
    this._meta.updateTag({
      name: 'description', content: this._originalDescription
    }, `name='description'`);
  }
}
