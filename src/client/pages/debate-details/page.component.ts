import {Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
export class DebateDetailsPageComponent {
  public debate: IDebate<any>;

  /**
   * Class constructor.
   */
  constructor (activatedRoute: ActivatedRoute) {
    let data = activatedRoute.snapshot.data.pageData as IPageData;

    this.debate = data.debate;
  }
}
