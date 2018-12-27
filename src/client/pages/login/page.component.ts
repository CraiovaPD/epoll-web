import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServerException } from 'exceptional.js';

// core
import { UserService } from '../../core/users/user.service';
import { AccountKitService } from '../../core/users/accountKit.service';
import { ErrorUtil } from '../../util/helpers/errorUtil';
import { WizardHostComponent } from '../../util/component/wizard-host/wizard-host.component';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { LocalStorage } from '../../util/storage/localStorage';

/**
 * Component used for displaying the Login page.
 *
 * @author Dragos Sebestin
 */
@Component({
  moduleId: module.id,
  templateUrl: 'page.component.html',
  styleUrls: [
    'page.component.css'
  ]
})
export class LoginPageComponent implements OnInit {
  @ViewChild(WizardHostComponent) private _wizardHost!: WizardHostComponent;
  private _lastAkCode: string = '';
  private _subscription?: Subscription;

  public phoneForm: FormGroup;
  public newUserProfileForm: FormGroup;
  public wizardPageIds = {
    phonePage: 'phone-page',
    profilePage: 'profile-page'
  };

  /**
   * Class constructor.
   */
  constructor (
    private _errors: ErrorUtil,
    private _users: UserService,
    private _akService: AccountKitService,
    private _router: Router,
    private _localStorage: LocalStorage,
    formBuilder: FormBuilder
  ) {
    this.phoneForm = formBuilder.group({
      phone: ['', Validators.compose([
        Validators.required, Validators.minLength(9),
        // .Validators.pattern('[0-9]')
      ])]
    });

    this.newUserProfileForm = formBuilder.group({
      firstname: ['', Validators.compose([
        Validators.required
      ])],
      lastname: [''],
      agreement: [false, Validators.compose([
        Validators.required
      ])]
    });
  }

  /**
   * Angular lifecycle hooks.
   */
  ngOnInit () {
    this._subscription = this._users.getProfile().pipe(skip(1))
      .subscribe(profile => {
        if (profile) {
          let redirectPage = this._localStorage.getItem('login-redirect-url');
          if (redirectPage) {
            this._localStorage.clear('login-redirect-url');
            if (redirectPage === '/login')
              return this._router.navigateByUrl('/');

            return window.location.href = redirectPage;
          }

          return this._router.navigateByUrl('/');
        }
      });
  }

  ngOnDestroy () {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  /**
   * Authenticate user via Account Kit.
   */
  async auth () {
    try {
      let phone = this.phoneForm.controls.phone.value;
      this._lastAkCode = await this._akService.login('+40', phone);
      await this._users.authenticate(this._lastAkCode);
    } catch (exception) {
      if (exception instanceof ServerException) {
        let ex: ServerException = exception;
        if (ex.status === 404) { // user account not registered
          this._wizardHost.goToPage(
            this.wizardPageIds.profilePage
          );
        }
      } else {
        this._errors.dispatch(exception);
      }
    }
  }

  /**
   * Register new user account.
   */
  async register () {
    try {
      let phone = this.phoneForm.controls.phone.value;
      let firstname = this.newUserProfileForm.controls.firstname.value;
      let lastname = this.newUserProfileForm.controls.lastname.value;

      let akCode = this._lastAkCode ? this._lastAkCode : await this._akService.login('+40', phone);
      await this._users.registerNewAccount({
        akCode,
        firstname,
        lastname
      });
    } catch (error) {
      this._errors.dispatch(error);
    }
  }

  /**
   * Go back to edit the phone number.
   */
  editPhone () {
    this._wizardHost.back();
  }
}
