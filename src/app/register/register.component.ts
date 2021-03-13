import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AlertService, AuthenticationService, UserService} from '../_services';
import {RegisterRequest} from '../_models';

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];


    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      console.log('already other error');
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      console.log('settting error to matching control')
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}


@Component({templateUrl: 'register.component.html',
  styleUrls: ['./register.component.css']})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    console.log('on init');
    // [ Validators.minLength(3), Validators.maxLength(15)]

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(40)])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(15)])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(40)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)])],
      confirmPassword: ['', Validators.compose([Validators.required,
        Validators.minLength(6), Validators.maxLength(20)])]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get getFormControls() {
    return this.registerForm.controls;
  }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    console.log('form value:', this.registerForm.value);

    const registerRequest = new RegisterRequest();
    registerRequest.name = this.registerForm.value.name;
    registerRequest.username = this.registerForm.value.username;
    registerRequest.email = this.registerForm.value.email;
    registerRequest.password = this.registerForm.value.password;
    registerRequest.confirmPassword = this.registerForm.value.confirmPassword;

    console.log('registerRequest: ', registerRequest);

    this.userService.register(registerRequest)
      .subscribe(
        data => {
          this.alertService.openSnackBar(`Registered successfully`, false);
          this.login(this.registerForm.value.username, this.registerForm.value.password);
        },
        error => {
          this.alertService.openSnackBar(`Failed to register`, true);
          this.loading = false;
        });
  }

  login(username, password) {
    this.loading = true;
    this.authenticationService.login(username, password)
      .subscribe(
        data => {
          this.router.navigate(['/']);
        },
        error => {
          this.alertService.openSnackBar(`Failed to loing!`, true);
          this.loading = false;
        });
  }
}
