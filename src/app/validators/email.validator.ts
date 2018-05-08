import { FormControl } from '@angular/forms';

export function ValidateEmail(c: FormControl) {
  let EMAIL_REGEXP = /^\S+@\S+\.\S+$/;
  return EMAIL_REGEXP.test(c.value) ? null : {
    ValidateEmail: {
      valid: false
    }
  };
}