import { Directive, OnInit, Input, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

/**
 * Directive used for adding JSON LD
 * schema to pages.
 *
 * @author Dragos Sebestin
 */
@Directive({
  selector: '[epoll-json-ld]'
})
export class JsonLdDirective implements OnInit {
  @Input() set schema (value: Object | undefined) {
    if (isPlatformBrowser(this._platformId)) return;

    if (value) {
      let schmaScriptEl = this._renderer.createElement('script');
      this._renderer.setAttribute(schmaScriptEl, 'type', 'application/ld+json');
      schmaScriptEl.text = JSON.stringify(value);
      this._renderer.appendChild(
        this._document.body,
        schmaScriptEl
      );
    }
  }

  /**
   * Class constructor.
   */
  constructor (
    @Inject(DOCUMENT) private _document: any,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _renderer: Renderer2
  ) { }

  ngOnInit () { }
}
