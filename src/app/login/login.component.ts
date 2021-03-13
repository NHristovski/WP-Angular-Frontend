import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

import {AlertService, AuthenticationService} from '../_services';

@Component({templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']})
export class LoginComponent implements OnInit {
  loading = false;
  returnUrl: string;
  logout: boolean;
  error: boolean;
  model: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.logout = this.route.snapshot.queryParams['logout'] || false;
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(
        data => {
          if (this.authenticationService.hasAdminRole()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
          this.alertService.openSnackBar(`Login successful`, false);
        },
        error => {
          this.alertService.openSnackBar('Failed to log in. Please check your credentials', true);
          this.loading = false;
        });
  }
}
