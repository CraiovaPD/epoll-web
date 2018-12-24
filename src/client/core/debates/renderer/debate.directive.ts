import {
  Directive,
  ViewContainerRef,
  ComponentFactoryResolver,
  Input,
  Type,
  OnInit,
  OnDestroy,
  ComponentRef
} from '@angular/core';
import { Subscription } from 'rxjs';

// core imports
import { DebateFactoryService } from './debate-factory.service';
import { IDebateComponent } from './components/IDebateComponent';
import { DebateService } from '../debate.service';
import { ErrorUtil } from '../../../util/helpers/errorUtil';

// types
import { IDebate } from '../../../types/debates/IDebate';

/**
 * Helper directive used to render a debate component.
 *
 * @author Dragos Sebestin
 */
@Directive({
  selector: '[epoll-debate]'
})
export class DebateDirective implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  private _compRef?: ComponentRef<IDebateComponent>;

  @Input('debate') private _debate: IDebate<any> | undefined;

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _view: ViewContainerRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _debatesComponentFactory: DebateFactoryService,
    private _debates: DebateService,
  ) {}

  /**
   * Angular lifecyle hooks.
   */
  ngOnInit () {
    if (this._debate)
      this._render(this._debatesComponentFactory.getComponent(this._debate));
  }
  ngOnDestroy () {
    for (let s of this._subscriptions)
      s.unsubscribe();
  }

  /**
   * Render component to view.
   */
  private _render (comp: Type<IDebateComponent>) {
    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(comp);
    this._compRef = this._view.createComponent(componentFactory);

    if (this._debate) {
      this._compRef.instance.setDebate(this._debate);
      let s = this._compRef.instance.vote$.subscribe(this._countVote.bind(this));
      this._subscriptions.push(s);
    }
  }

  /**
   * Add a new vote to the debate.
   */
  private async _countVote (optionId: string) {
    if (!this._debate || !this._compRef) return;

    try {
      let newVote = await this._debates.voteOnPoll({
        pollId: this._debate._id,
        selectedOptionId: optionId
      }).toPromise();
      if (this._compRef) {
        let pollPayload = Object.assign({}, this._debate.payload, {
          votes: {
            count: this._debate.payload.votes.count + 1,
            data: this._debate.payload.votes.data.concat(newVote)
          }
        });
        let newDebate = Object.assign({}, this._debate, {
          payload: pollPayload
        });
        Object.freeze(newDebate);
        this._compRef.instance.setDebate(newDebate);
      }
    } catch (error) {
      this._errors.dispatch(error);
    }
  }
}
