import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RegisterComponent} from './register';
import {HomeComponent} from './home';
import {ErrorInterceptor, JwtInterceptor} from './_helpers';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddProductComponent } from './add-product/add-product.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ProductComponent } from './product/product.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatGridListModule} from '@angular/material/grid-list';
import { ProductDetailsComponent } from './product-details/product-details.component';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import {MatMenuModule} from '@angular/material/menu';
import { ShoppingCartHistoryComponent } from './shopping-cart-history/shopping-cart-history.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CheckoutComponent } from './checkout/checkout.component';
import {NgPaymentCardModule} from 'ng-payment-card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminComponent } from './admin/admin.component';
import {MatSelectModule} from '@angular/material/select';
import { RestockDialogComponent } from './restock-dialog/restock-dialog.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AddProductComponent,
    ProductComponent,
    ProductDetailsComponent,
    ToolbarComponent,
    ShoppingCartComponent,
    ShoppingCartHistoryComponent,
    ConfirmDialogComponent,
    CheckoutComponent,
    AdminComponent,
    RestockDialogComponent,
    OrderDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    NgbModule,
    MatGridListModule,
    MatListModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    CdkTableModule,
    MatMenuModule,
    NgPaymentCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
