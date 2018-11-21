import {FormGroup, FormControl} from '@angular/forms';

/**
 * Namespace holding various form helper methods.
 */

/**
 * Check if a form group passes all of it's validators.
 */
export function isFormValid (form: FormGroup) : boolean {
  for (let key in form.controls) {
    let control = form.controls[key];

    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  return form.valid;
}

/**
 * Check if a value is a valid phone number.
 *
 * @param phone Phone value string to check
 * @return {boolean} true if the provided string is a valid phone number
 * otherwise false
 */
export function isPhone (phone: any) : boolean {
  return (!!phone) && (/^07[0-9]+$/i.test(phone)) && (phone.length === 10);
}

/**
 * Phone number validator for form controls.
 */
export function isValidPhoneNumber (control: FormControl) {
  if (!control)
    return null;

  let phone = control.value;
  if ( !isPhone(phone) )
    return {
      custom: {
        message: 'Ai introdus un numar de telefon incorect.'
      }
    };

  return null;
}

/**
 * Phone number validator only if a value exists
 */
export function existsValidPhoneNumber (control: FormControl) {
  if (!control)
    return null;

  let phone = control.value;
  if ( !!phone && (!isPhone(phone)) )
    return {
      custom: {
        message: 'Ai introdus un numar de telefon incorect.'
      }
    };

  return null;
}
