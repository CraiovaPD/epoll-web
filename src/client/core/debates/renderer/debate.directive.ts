import {
  Directive,
  ViewContainerRef,
  ComponentFactoryResolver,
  Input,
  Type,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Store } from '@ngrx/store';

// core imports
import { DebateFactoryService } from './debate-factory.service';
import { IDebateComponent } from './components/IDebateComponent';

// store
import { IAppState } from '../../../store/IApp';
import { SetActiveDebate } from '../../../store/debates/activeDebate.actions';

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
  @Input('debate') private _debate: IDebate<any> | undefined;

  /**
   * Class constructor.
   */
  constructor (
    private _view: ViewContainerRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _debatesComponentFactory: DebateFactoryService,
    private _store: Store<IAppState>
  ) {}

  /**
   * Angular lifecyle hooks.
   */
  ngOnInit () {
    if (this._debate) {
      this._store.dispatch(new SetActiveDebate(this._debate));
      this._render(this._debatesComponentFactory.getComponent(this._debate));
    }
  }
  ngOnDestroy () {
  }

  /**
   * Render component to view.
   */
  private _render (comp: Type<IDebateComponent>) {
    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(comp);
    this._view.createComponent(componentFactory);
  }
}
