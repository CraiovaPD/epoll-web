import {
  Component, OnInit, Input, Output,
  EventEmitter, ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// types
import { IDebate, IPollDebate } from '../../../../types/debates/IDebate';
import { IUser } from '../../../../types/users/IUser';
import { IVote } from '../../../../types/debates/IVote';
import { ErrorUtil } from '../../../../util/helpers/errorUtil';

export interface IPollResult {
  _id: string,
  name: string,
  count: number
}

/**
 * Component used for rendering a vote widget for a poll.
 *
 * Displays vote form if user hasn't voted, or the poll
 * results otherwise.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  selector: 'epoll-poll-vote',
  templateUrl: 'poll-vote.component.html',
  styleUrls: [
    'poll-vote.component.css'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PollVoteComponent implements OnInit {
  private _loggedInUser?: IUser;
  private _ownVote?: IVote;

  @Input() public debate!: IDebate<IPollDebate>;
  @Output() public optionVoted = new EventEmitter();
  public voteForm: FormGroup;
  public hasNotVoted = false;
  public pollResults: IPollResult[] = [];

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    formBuilder: FormBuilder
  ) {
    this.voteForm = formBuilder.group({
      voteOptionId: ['', Validators.required]
    });
  }

  /**
   * Setters / Getters
   */
  @Input() public set user (value: IUser | undefined) {
    try {
      this._loggedInUser = value;
      this._computeState(value);
    } catch (error) {
      this._errors.dispatch(error);
    }
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
  }

  /**
   * Submit a new vote to this poll.
   */
  submitVote (optionId: string) {
    if (confirm('Esti sigur ca vrei sa alegi aceasta optiune?')) {
      this.optionVoted.emit(optionId);

      // mark poll as voted
      this.hasNotVoted = false;

      // add vote to counters
      this.pollResults = this.pollResults.map(
        res => {
          if (res._id === optionId) {
            return Object.assign({}, res, {
              count: res.count + 1
            });
          }

          return res;
        }
      );
    }
  }

  /**
   * Check if the debate can be edited.
   */
  canEdit () : boolean {
    if (!this._loggedInUser) return false;

    return this._loggedInUser._id === this.debate.createdBy;
  }

  /**
   * Check if a poll result is the same as the one the user voted.
   */
  isSelectedOption (resultId: string) : boolean {
    if (!this._loggedInUser) return false;
    if (!this._ownVote) return false;

    return this._ownVote.optionId === resultId;
  }

  /**
   * Do initial computations.
   */
  private _computeState (loggedInUser?: IUser) {
    // compute poll results
    this.pollResults = this.debate.payload.options.map(option => {
      let count = this.debate.payload.votes.data.reduce((sum: number, crt: IVote) => {
        return sum + (crt.optionId === option._id ? 1 : 0);
      }, 0);

      return {
        _id: option._id,
        name: option.reason,
        count
      };
    });

    // check if user has already voted
    let userId = loggedInUser ? loggedInUser._id : '';
    this.hasNotVoted = !this.debate.payload.votes.data.some(
      vote => vote.userId === userId
    );

    // determine own vote, if it exists
    if (userId) {
      this._ownVote = this.debate.payload.votes.data.find(
        vote => vote.userId === userId
      );
    }
  }
}
