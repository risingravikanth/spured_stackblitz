import { AbstractControl } from '@angular/forms';

export function ValidateAutoComplete(control: AbstractControl) {
  if (typeof control.value === "string") {
    return { validData: true };
  }
  return null;
}