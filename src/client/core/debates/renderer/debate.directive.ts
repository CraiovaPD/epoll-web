import {
  Directive,
  ViewContainerRef,
  ComponentFactoryResolver,
  Input,
  Type,
  OnInit
} from '@angular/core';
import { IDebate } from '../../../types/debates/IDebate';
import { DebateFactoryService } from './debate-factory.service';
import { IDebateComponent } from './components/IDebateComponent';

/**
 * Helper directive used to render a debate component.
 *
 * @author Dragos Sebestin
 */
@Directive({
  selector: '[epoll-debate]'
})
export class DebateDirective implements OnInit {
  @Input('debate') private _debate: IDebate<any> | undefined;

  /**
   * Class constructor.
   */
  constructor (
    private _view: ViewContainerRef,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _debatesComponentFactory: DebateFactoryService
  ) {}

  /**
   * Angular lifecyle hooks.
   */
  ngOnInit () {
    if (this._debate)
      this.render(this._debatesComponentFactory.getComponent(this._debate));
  }

  /**
   * Render component to view.
   */
  private render (comp: Type<IDebateComponent>) {
    let componentFactory = this._componentFactoryResolver.resolveComponentFactory(comp);
    let componentRef = this._view.createComponent(componentFactory);

    if (this._debate)
      componentRef.instance.setDebate(this._debate);
  }
}
