import { Component, OnInit } from '@angular/core';
import moment from 'moment';

import { IDebateComponent } from './IDebateComponent';

// types
import { IDebate, IPollDebate } from '../../../../types/debates/IDebate';
import { IAttachment } from '../../../../types/debates/IAttachment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  /**
   * Class constructor.
   */
  constructor (formBuilder: FormBuilder) {
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
  }

  /**
   * Get a string formatted for displaying the time
   * ago at which a debate was created.
   */
  getAgoTime (debate: IDebate<any>) : string {
    return moment(debate.createdAt).fromNow(true);
  }

  /**
   * Download an attachment on the device.
   */
  downloadAttachment (attachment: IAttachment) {
    attachment.file.originalName;
  }
}
