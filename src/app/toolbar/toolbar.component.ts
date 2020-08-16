import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services';
import {Router} from '@angular/router';
import {ToolbarStateService} from '../_services/toolbar-state.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  public username: string;

  constructor(private authService: AuthenticationService,
              private router: Router,
              private toolbarStateService: ToolbarStateService
  ) {
  }

  ngOnInit(): void {
    this.username = this.authService.currentUserValue.username;
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login'], {queryParams: {logout: true}});
  }


  productCatalog() {
    this.toolbarStateService.changeCurrentlyActive(0);
    this.router.navigate(['/']);
  }

  shoppingCart() {
    this.toolbarStateService.changeCurrentlyActive(1);
    this.router.navigate(['/shopping-cart']);
  }

  history() {
    this.toolbarStateService.changeCurrentlyActive(2);
    this.router.navigate(['/shopping-cart-history']);
  }

  productManagement() {
    this.toolbarStateService.changeCurrentlyActive(3);
    this.router.navigate(['/admin']);
  }
}
