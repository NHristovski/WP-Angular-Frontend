import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroupDirective, NgForm, ValidatorFn, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ShoppingCart} from '../_models/shoppingCart/shoppingCart';
import {AlertService} from '../_services';
import {PaymentService} from '../_services/payment.service';
import {Price} from '../_models/_value/product/Price';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export function telNumberValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const num = control.value;
    if (num.length === 0) {
      return {'Wrong Number Format': {value: control.value}};
    }

    const ok = num.match(/\d/g).length === 9;
    return ok ? null : {'Wrong Number Format': {value: control.value}};
  };
}

export function creditCardValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const num = control.value.replace(/\D/g, '');
    if (num.length === 0) {
      return null;
    }

    const ok = luhnValidate(num);
    return ok ? null : {'creditcard': {value: control.value}};
  };
}

export function luhnChecksum(code) {
  const len = code.length;
  const parity = len % 2;
  let sum = 0;
  for (let i = len - 1; i >= 0; i--) {
    let d = parseInt(code.charAt(i));
    if (i % 2 === parity) {
      d *= 2;
    }
    if (d > 9) {
      d -= 9;
    }
    sum += d;
  }
  return sum % 10;
}

/* luhn_caclulate
 * Return a full code (including check digit), from the specified partial code (without check digit).
 */
export function luhnCaclulate(partcode) {
  const checksum = luhnChecksum(partcode + '0');
  return checksum === 0 ? 0 : 10 - checksum;
}

/* luhn_validate
 * Return true if specified code (with check digit) is valid.
 */
export function luhnValidate(fullcode) {
  return luhnChecksum(fullcode) === 0;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  shoppingCart: ShoppingCart;
  price: Price;
  showError = false;

  deliveryFormControl = new FormControl('', [
    Validators.required
  ]);

  phoneFormControl = new FormControl('', [
    telNumberValidator()
  ]);

  creditCardFormControl = new FormControl('', [
    Validators.required,
    creditCardValidator()
  ]);

  matcher = new MyErrorStateMatcher();
  cardHolderNameFormControl = new FormControl('', [
    Validators.required,
  ]);

  expirationDateFormControl = new FormControl('', [
    Validators.required,
  ]);

  ccvFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(3),
    Validators.minLength(3)
  ]);
  loading: boolean;

  constructor(private dialogRef: MatDialogRef<CheckoutComponent>,
              private paymentService: PaymentService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.loading = false;
  }

  onSubmit() {
    this.loading = true;

    const buyReq = {
      shoppingCartId: this.shoppingCart.shoppingCartId,
      cardHolderName: this.cardHolderNameFormControl.value,
      ccv: this.ccvFormControl.value,
      creditCard: this.creditCardFormControl.value,
      deliveryAddress: this.deliveryFormControl.value,
      expiryDate: this.expirationDateFormControl.value,
      phone: this.phoneFormControl.value,
      price: this.price
    };

    this.paymentService.charge(buyReq)
      .subscribe(data => {
        setTimeout(() => {
            this.alertService.openSnackBar('Success!', false);
            this.loading = false;
            this.closeDialog();
          },
          4000);

      }, error => {
        this.alertService.openSnackBar('Failed to buy the products', true);
        this.loading = false;
        this.showError = true;
      });
  }

  validForm(): boolean {
    return this.deliveryFormControl.valid &&
      this.ccvFormControl.valid &&
      this.expirationDateFormControl.valid &&
      this.cardHolderNameFormControl.valid &&
      this.creditCardFormControl.valid &&
      this.phoneFormControl.valid;
  }

  closeDialog() {
    console.log('in close dialog');
    this.dialogRef.close(true);
  }
}
