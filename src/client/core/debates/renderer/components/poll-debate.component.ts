import { Component, OnInit, Inject } from '@angular/core';
import moment from 'moment';

import { IDebateComponent } from './IDebateComponent';
import { ENVIRONMENT_CONFIG, IEnvironmentConfig } from '../../../../environment.config';

// types
import { IDebate, IPollDebate } from '../../../../types/debates/IDebate';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DebateService } from '../../debate.service';
import { IVote } from '../../../../types/debates/IVote';
import { IAttachment } from '../../../../types/debates/IAttachment';
import { ErrorUtil } from '../../../../util/helpers/errorUtil';

export interface IPollResult {
  name: string,
  count: number
}

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
  ]
})
export class PollDebateComponent implements IDebateComponent, OnInit {
  public debate: IDebate<IPollDebate> | undefined;
  public voteForm: FormGroup;
  public hasNotVoted = false;
  public pollResults: IPollResult[] = [];

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _debates: DebateService,
    @Inject(ENVIRONMENT_CONFIG) private _env: IEnvironmentConfig,
    formBuilder: FormBuilder
  ) {
    this.voteForm = formBuilder.group({
      voteOptionId: ['', Validators.required]
    });
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () { }

  /**
   * IDebateComponent interface methods.
   */
  setDebate (debate: IDebate<any>): void {
    this.debate = debate;

    // check if user has already voted

    // compute poll results
    this.pollResults = this.debate.payload.options.map(option => {
      let count = debate.payload.votes.data.reduce((sum: number, crt: IVote) => {
        return sum + (crt.optionId === option._id ? 1 : 0);
      }, 0);

      return {
        name: option.reason,
        count
      };
    });
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
  async vote (debate: IDebate<any>, optionId: string) {
    try {
      await this._debates.voteOnPoll({
        pollId: debate._id,
        selectedOptionId: optionId
      });
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
${debate.payload.title}

${window.location.href}
`
    );
  }

  /**
   * Share page on Facebok.
   */
  facebookShare (debate: IDebate<any>) {
    if (this.debate) {
      let pageUrl = encodeURIComponent(window.location.href);
      let shareQuote = encodeURIComponent(debate.payload.title);
      let shareTag = encodeURIComponent(SHARE_HASHTAG);
      /* tslint:disable */
      let shareUrl = `https://www.facebook.com/dialog/share?app_id=${this._env.facebook.appId}&display=popup&href=${pageUrl}&quote=${shareQuote}&hashtag=${shareTag}`;
      /* tslint:enable */
      window.open(shareUrl, '', 'height=300,width=600');
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
      let attachment = await this._debates.addAttachment({
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
        await this._debates.removeAttachment({
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
}
