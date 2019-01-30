import {
  Directive,
  ViewContainerRef,
  ComponentFactoryResolver,
  Input,
  Type,
  OnInit,
  OnDestroy
} from '@angular/core';

// core imports
import { DebateFactoryService } from './debate-factory.service';
import { IDebateComponent } from './components/IDebateComponent';

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
  ) {}

  /**
   * Angular lifecyle hooks.
   */
  ngOnInit () {
    if (this._debate) {
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
