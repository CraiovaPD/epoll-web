import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import EPollAPI from 'epoll-api-sdk';

// types
import { IDebatePollListItem, IDebate, DebateState, IDebateAnouncementListItem } from '../../types/debates/IDebate';
import { IVote } from '../../types/debates/IVote';
import { IAttachment } from '../../types/debates/IAttachment';

/**
 * Angular Debate service class.
 *
 * @author Dragos Sebestin
 */
@Injectable()
export class DebateService {

  /**
   * Class constructor.
   */
  constructor (
  ) {}

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () { }

  /**
   * Create a new poll debate.
   */
  createNewPollDebate (params: {
    title: string,
    content: string
  }) {
    return EPollAPI.Debates().createNewPoll({
      title: params.title,
      content: params.content
    });
  }

  /**
   * List polls.
   */
  listPolls (params: {
    fromId?: string,
    state?: {
      from: DebateState,
      to: DebateState
    },
    limit?: number
  }) : Observable<IDebatePollListItem[]> {
    return EPollAPI.Debates().listPolls({
      fromId: params.fromId,
      state: params.state,
      limit: params.limit
    });
  }

  /**
   * Get Poll by id.
   */
  getPollById (id: string) : Observable<IDebate<any>> {
    return EPollAPI.Debates().getDebateById(id);
  }

  /**
   * Add new vote option to a poll.
   */
  addPollVoteOption (params: {
    pollId: string,
    optionReason: string
  }) {
    return EPollAPI.Debates().addPollOption({
      pollId: params.pollId,
      reason: params.optionReason
    });
  }

  /**
   * Remove a vote option from a poll.
   */
  removePollVoteOption (params: {
    pollId: string,
    optionId: string
  }) {
    return EPollAPI.Debates().removePollOption({
      pollId: params.pollId,
      optionId: params.optionId
    });
  }

  /**
   * Add vote to poll.
   */
  voteOnPoll (params: {
    pollId: string,
    selectedOptionId: string
  }) : Observable<IVote> {
    return EPollAPI.Debates().addPollVote({
      pollId: params.pollId,
      optionId: params.selectedOptionId
    });
  }

  /**
   * Add a new attachment.
   */
  addAttachment (params: {
    pollId: string,
    formData: FormData
  }) : Observable<IAttachment> {
    return EPollAPI.Debates().addPollAttachment({
      pollId: params.pollId,
      formData: params.formData
    });
  }

  /**
   * Remove an attachment.
   */
  removeAttachment (params: {
    pollId: string,
    attachmentId: string
  }) {
    return EPollAPI.Debates().removePollAttachment({
      pollId: params.pollId,
      attachmentId: params.attachmentId
    });
  }

  /**
   * Update a debate by id.
   */
  updateDebate (params: {
    debateId: string,
    newTitle: string,
    newContent: string
  }) {
    return EPollAPI.Debates().updateDebate({
      debateId: params.debateId,
      newTitle: params.newTitle,
      newContent: params.newContent
    });
  }

  /**
   * List anouncements.
   */
  listAnouncements (params: {
    fromId?: string,
    state?: {
      from: DebateState,
      to: DebateState
    },
    limit?: number
  }) : Observable<IDebateAnouncementListItem[]> {
    return EPollAPI.Debates().listAnouncements({
      fromId: params.fromId,
      state: params.state,
      limit: params.limit
    });
  }
}
