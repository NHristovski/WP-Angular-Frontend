import {Component, OnInit} from '@angular/core';
import {ShoppingCartService} from '../_services/shopping-cart.service';
import {ShoppingCart} from '../_models/shoppingCart/shoppingCart';
import {Router} from '@angular/router';
import {ShoppingCartItem} from '../_models/shoppingCart/shoppingCartItem';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {CheckoutComponent} from '../checkout/checkout.component';
import {AlertService} from '../_services';
import {ShoppingCartId} from '../_models/_value/shoppingCart/ShoppingCartId';
import {ProductId} from '../_models/_value/product/ProductId';
import {ProductService} from '../_services/product.service';
import {ProductDetailsComponent} from '../product-details/product-details.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToolbarStateService} from '../_services/toolbar-state.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  public shoppingCart: ShoppingCart;
  displayedColumns = ['name', 'quantity', 'cost', 'totalCost', 'action'];
  public dataSource = new MatTableDataSource();
  maxQuantityReachedProducts: string[] = [];
  exchangeRates: Map<string, any>;
  currencies = ['MKD', 'USD', 'EUR'];

  currencyForm: FormGroup;
  totalCost: number;

  constructor(private shoppingCartService: ShoppingCartService,
              private toolbarStateService: ToolbarStateService,
              private router: Router,
              public dialog: MatDialog,
              private productService: ProductService,
              private alertService: AlertService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {

    this.currencyForm = this.formBuilder.group({
      currency: ['MKD', Validators.compose([Validators.required])]
    });

    this.exchangeRates = new Map<string, any>();
    this.exchangeRates.set('MKD', {
      'USD': 0.019,
      'MKD': 1,
      'EUR': 0.016
    });
    this.exchangeRates.set('USD', {
      'MKD': 52.02,
      'USD': 1,
      'EUR': 0.85
    });
    this.exchangeRates.set('EUR', {
      'USD': 1.18,
      'EUR': 1,
      'MKD': 61.5
    });

    this.shoppingCartService.getShoppingCart()
      .subscribe(data => {
        this.shoppingCart = data.shoppingCart;
        //   new ShoppingCart();
        // this.shoppingCart.id = data.id;
        // this.shoppingCart.items = data.shoppingCartItems;
        console.log('the shopping cart is ', this.shoppingCart);
        this.totalCost = this.getTotalCost();

        this.dataSource.data = this.shoppingCart.shoppingCartItems;

      }, error => {
        this.alertService.openSnackBar(`Failed to get the shopping cart!`, true);
      });

    this.toolbarStateService.currentlyActive = 1;
  }


  /** Gets the total cost of all products. */
  getTotalCost() {
    return this.shoppingCart.shoppingCartItems.reduce(
      (acc, value) => acc +
        ((value.price.amount * value.quantity.quantity) *
          this.exchangeRates.get(value.price.currency)[this.currencyForm.controls.currency.value]), 0
    );
  }

  getTotalCostForCurrency(currency: string) {
    return this.shoppingCart.shoppingCartItems.reduce(
      (acc, value) => acc +
        ((value.price.amount * value.quantity.quantity) *
          this.exchangeRates.get(value.price.currency)[currency]), 0
    );
  }


  productCatalog() {
    this.router.navigate(['/']);
  }

  incrementQuantity(shoppingCartId: ShoppingCartId, sci: ShoppingCartItem) {
    this.shoppingCartService.incrementQuantity(shoppingCartId, sci.shoppingCartItemId)
      .subscribe(data => {
        this.shoppingCart.shoppingCartItems.map(i => {
          if (i.shoppingCartItemId.id === sci.shoppingCartItemId.id) {
            i.quantity.quantity = i.quantity.quantity + 1;
          }
          return i;
        });
        this.totalCost = this.getTotalCost();
      }, error => {
        this.alertService.openSnackBar(`Product max quantity reached!`, true);
        this.maxQuantityReachedProducts.push(sci.productId.id);
      });
  }

  decrementQuantity(shoppingCartId: ShoppingCartId, sci: ShoppingCartItem) {
    if (sci.quantity.quantity === 1) {
      this.delete(shoppingCartId, sci);
    } else {
      this.shoppingCartService.decrementQuantity(shoppingCartId, sci.shoppingCartItemId)
        .subscribe(data => {
          this.shoppingCart.shoppingCartItems.map(i => {
            if (i.shoppingCartItemId.id === sci.shoppingCartItemId.id) {
              i.quantity.quantity = i.quantity.quantity - 1;
            }
            return i;
          });
          this.totalCost = this.getTotalCost();

          this.maxQuantityReachedProducts = this.maxQuantityReachedProducts.filter(
            it => it !== sci.productId.id
          );
        }, error => {
          this.alertService.openSnackBar(`Failed to decrement quantity!`, true);
        });
    }
  }

  delete(cartId: ShoppingCartId, item: ShoppingCartItem) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shoppingCartService.delete(cartId, item.shoppingCartItemId)
          .subscribe(data => {
            const index = this.shoppingCart.shoppingCartItems.indexOf(item, 0);
            if (index > -1) {
              this.shoppingCart.shoppingCartItems = this.shoppingCart.shoppingCartItems.filter(
                i => i.shoppingCartItemId.id !== item.shoppingCartItemId.id
              );
            }

            this.dataSource.data = this.shoppingCart.shoppingCartItems;
            this.totalCost = this.getTotalCost();
            this.alertService.openSnackBar(`Removed the product from the shopping cart!`, false);
          }, error => {
            this.alertService.openSnackBar(`Failed to delete the product!`, true);
          });
      }
    });
  }

  proceedToCheckout() {
    const dialogRef = this.dialog.open(CheckoutComponent, {
      width: '500px',
      height: '620px'
    });

    dialogRef.componentInstance.shoppingCart = this.shoppingCart;
    dialogRef.componentInstance.price = {
      amount: this.getTotalCostForCurrency('MKD'),
      currency: 'MKD'
    };

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shoppingCart.shoppingCartItems = [];
        this.dataSource.data = [];
      }
    });
  }

  showDetails(productId: ProductId) {
    this.productService.getProduct(productId).subscribe(data => {
      const dialogRef = this.dialog.open(ProductDetailsComponent);
      dialogRef.componentInstance.product = data.personalizedProduct;

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const index = this.shoppingCart.shoppingCartItems.findIndex(x => x.productId.id === productId.id);
          if (index > -1) {
            this.shoppingCart.shoppingCartItems[index].quantity.quantity =
              this.shoppingCart.shoppingCartItems[index].quantity.quantity
              + dialogRef.componentInstance.quantity;
          }
        }
      });
    }, error => {
      this.alertService.openSnackBar(`Failed to open product details`, true);
    });

  }

  currencyChanged(event: any) {
    this.totalCost = this.getTotalCost();
  }
}
