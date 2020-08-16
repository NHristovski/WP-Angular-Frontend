import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from '../_services';
import {Order} from '../_models/order/Order';
import {OrderService} from '../_services/order.service';
import {MatDialog} from '@angular/material/dialog';
import {OrderDetailsComponent} from '../order-details/order-details.component';
import {ToolbarStateService} from '../_services/toolbar-state.service';

@Component({
  selector: 'app-shopping-cart-history',
  templateUrl: './shopping-cart-history.component.html',
  styleUrls: ['./shopping-cart-history.component.css']
})
export class ShoppingCartHistoryComponent implements OnInit {

  public orders: Order[];
  displayedColumns = ['orderId', 'createdOn', 'price', 'shippingAddress', 'status', 'actions'];

  constructor(private orderService: OrderService,
              private router: Router,
              private alertService: AlertService,
              public dialog: MatDialog,
              private toolbarStateService: ToolbarStateService) {
  }

  ngOnInit(): void {

    this.toolbarStateService.changeCurrentlyActive(2);

    this.orderService.getOrders()
      .subscribe(data => {
        this.orders = data.orders;

      }, error => {
        this.alertService.openSnackBar(`Failed to get the orders!`, true);
      });
  }

  productCatalog() {
    this.router.navigate(['/']);
  }

  showDetails(item: Order) {
    const dialogRef = this.dialog.open(OrderDetailsComponent, {
      width: '80%',
    });
    dialogRef.componentInstance.order = item;
    dialogRef.componentInstance.orderStatus = 0;

    dialogRef.afterClosed().subscribe(result => {
      dialogRef.componentInstance.subscription.unsubscribe();

      const index = this.orders.findIndex(order => order.orderId.id === item.orderId.id);

      if (index > -1) {
        this.orders[index].status = dialogRef.componentInstance.order.status;
      }
    });
  }
}
