import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ErrorUtil } from '../../util/helpers/errorUtil';
import { DebateService } from '../../core/debates/debate.service';

export interface IVoteOption {
  text: string,
  placeholder: string
}

/**
 * Component used for displaying a page from
 * where a new anouncement can be created.
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
export class AddNewAnouncementPageComponent implements OnInit, OnDestroy {
  public title = '';
  public content = '';
  public files: File[] = [];
  public isUIEnabled = true;

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _debateService: DebateService,
    private _router: Router
  ) {
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

  /**
   * Create a new anouncement.
   */
  async createAnouncement () {
    try {
      this._toggleUI(false);
      let anouncement = await this._debateService.createNewAnouncementDebate({
        title: this.title.trim(),
        content: this.content.trim()
      }).toPromise();

      // submit attachments
      for (let file of this.files) {
        let formData = new FormData();
        formData.append('attachment', file);
        await this._debateService.addAnouncementAttachment({
          anouncementId: anouncement._id,
          formData
        }).toPromise();
      }

      this._router.navigate(['/debates', anouncement._id]);

    } catch (error) {
      this._errors.dispatch(error);
    } finally {
      this._toggleUI(true);
    }
  }

  /**
   * Add attachments.
   */
  addAttachments (files: FileList) {
    try {
      this.files = this.files.concat(Array.from(files));
    } catch (error) {
      this._errors.dispatch(error);
    }
  }

  /**
   * Remove an attachment by index.
   */
  removeAttachment (index: number) {
    this.files.splice(index, 1);
  }

  private _toggleUI (enable: boolean) {
    this.isUIEnabled = enable;
  }
}
