import {
  Directive,
  NgZone,
  OnInit,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {FormControl} from '@angular/forms';

@Directive({
  selector: '[epoll-file-picker]'
})
export class FilePickerDirective implements OnInit {
  @Input('form-control') formControl: FormControl;
  @Input('auto-reset') autoReset: boolean = false;
  @Output() onPick: EventEmitter<FileList> = new EventEmitter();

  /**
   * Class constructor.
   */
  constructor (
    private _zone: NgZone,
    private _elementRef: ElementRef
  ) {
    this.formControl = new FormControl('');
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
    let inputEl = this._elementRef.nativeElement as HTMLInputElement;
    inputEl.addEventListener('change', () => {
      this._zone.run(() => {
        if (inputEl.files) {
          this.updateControlValue(inputEl.files);
          this.onPick.emit(inputEl.files);
        }

        if (this.autoReset) {
          this.reset();
        }
      });
    });
  }

  /**
   * Reset input value.
   */
  public reset () {
    let inputEl = this._elementRef.nativeElement as HTMLInputElement;
    inputEl.value = '';
  }

  /**
   * Run control validation.
   */
  private updateControlValue (files: FileList) {
    if (this.formControl) {
      this.formControl.setValue(files);
      this.formControl.updateValueAndValidity();
    }
  }
}
