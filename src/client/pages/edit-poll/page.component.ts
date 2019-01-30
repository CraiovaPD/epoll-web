import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ErrorUtil } from '../../util/helpers/errorUtil';
import { DebateService } from '../../core/debates/debate.service';

// types
import { IDebate, IPollDebate } from '../../types/debates/IDebate';
import { IAttachment } from '../../types/debates/IAttachment';

export interface IPageData {
  debate: IDebate<any>
}
export interface IVoteOption {
  text: string,
  placeholder: string
}

/**
 * Component used for displaying a page from
 * where an existing poll can be edited.
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
export class EditPollDebatePageComponent implements OnInit, OnDestroy {
  public debate!: IDebate<IPollDebate>;
  public newVoteOptions: IVoteOption[] = [];
  public isUIEnabled = true;

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _debateService: DebateService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
  }

  /**
   * Angular lifecycle hooks
   */
  async ngOnInit () {
    try {
      let pageData: IPageData = this._activatedRoute.snapshot.data.pageData;
      this.debate = pageData.debate;
    } catch (err) {
      this._errors.dispatch(err);
    }
  }

  ngOnDestroy () {
  }

  /**
   * Save changes made to this debate.
   */
  async commitChanges () {
    try {
      this._toggleUI(false);

      // update debate
      await this._debateService.updateDebate({
        debateId: this.debate._id,
        newTitle: this.debate.title,
        newContent: this.debate.content
      }).toPromise();

      // process newly added options
      for (let newOption of this.newVoteOptions) {
        if (!newOption.text) continue;

        await this._debateService.addPollVoteOption({
          pollId: this.debate._id,
          optionReason: newOption.text
        }).toPromise();
      }

      // go back to view mode
      this._router.navigate(['/debates', this.debate._id]);
    } catch (error) {
      this._errors.dispatch(error);
    } finally {
      this._toggleUI(true);
    }
  }

  /**
   * Add a new attachment to this poll.
   */
  async addAttachment (
    debate: IDebate<IPollDebate>,
    files: FileList
  ) {
    try {
      let formData = new FormData();
      formData.append('attachment', files[0]);
      let attachment = await this._debateService.addPollAttachment({
        pollId: debate._id,
        formData
      }).toPromise();

      debate.payload.attachments.push(attachment);
    } catch (error) {
      this._errors.dispatch(error);
    }
  }

  /**
   * Remove an attachment.
   */
  async removeAttachment (
    debate: IDebate<IPollDebate>,
    attachment: IAttachment
  ) {
    try {
      if (
        confirm(`Esti sigur ca vrei sa stergi acest atasament "${attachment.file.originalName}"?`)
      ) {
        await this._debateService.removePollAttachment({
          pollId: debate._id,
          attachmentId: attachment._id
        }).toPromise();

        let foundIndex = debate.payload.attachments.findIndex(
          att => att._id === attachment._id
        );
        if (~foundIndex) {
          debate.payload.attachments.splice(foundIndex, 1);
        }
      }
    } catch (error) {
      this._errors.dispatch(error);
    }
  }

  /**
   * Remove existing vote option.
   */
  async removeExistingVoteOption (
    debate: IDebate<IPollDebate>,
    optionId: string
  ) {
    if (!confirm(`Esti sigur ca vrei sa stergi aceasta optiune?`)) return;
    try {
      await this._debateService.removePollVoteOption({
        pollId: debate._id,
        optionId
      }).toPromise();

      let foundIndex = this.debate.payload.options.findIndex(vo => vo._id === optionId);
      if (~foundIndex) {
        this.debate.payload.options.splice(foundIndex, 1);
      }
    } catch (error) {
      this._errors.dispatch(error);
    }
  }

  /**
   * Add an empty vote option.
   */
  addEmptyVoteOption () {
    this.newVoteOptions.push({
      text: '',
      placeholder: ''
    });
  }

  /**
   * Remove newly added vote option.
   */
  removeEmptyVoteOption (index: number) {
    this.newVoteOptions.splice(index, 1);
  }

  private _toggleUI (enable: boolean) {
    this.isUIEnabled = enable;
  }
}
