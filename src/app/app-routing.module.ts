import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RegisterComponent} from './register';
import {LoginComponent} from './login';
import {AuthGuard} from './_helpers';
import {HomeComponent} from './home';
import {AddProductComponent} from './add-product/add-product.component';
import {ProductDetailsComponent} from './product-details/product-details.component';
import {ShoppingCartComponent} from './shopping-cart/shopping-cart.component';
import {ShoppingCartHistoryComponent} from './shopping-cart-history/shopping-cart-history.component';
import {AdminComponent} from './admin/admin.component';
import {AdminGuard} from './_helpers/admin.guard';
import {OrderManagementComponent} from './order-management/order-management.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'product/:id', component: ProductDetailsComponent, canActivate: [AuthGuard]},
  { path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard] },
  { path: 'shopping-cart-history', component: ShoppingCartHistoryComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'order-management', component: OrderManagementComponent, canActivate: [AdminGuard] },
  { path: 'add-product', component: AddProductComponent, canActivate: [AdminGuard]},
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
