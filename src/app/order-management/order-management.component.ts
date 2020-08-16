import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AlertService} from '../_services';
import {Order} from '../_models/order/Order';
import {OrderService} from '../_services/order.service';
import {ToolbarStateService} from '../_services/toolbar-state.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {

  submittedSearch = false;
  searchForm: FormGroup;
  orders: Order[];
  displayedColumns = ['orderId', 'userId', 'createdOn', 'price', 'status', 'actions'];
  onceSubmited = false;
  hasProducts = false;

  constructor(private formBuilder: FormBuilder,
              private orderService: OrderService,
              private alertService: AlertService,
              private toolbarStateService: ToolbarStateService) {
  }

  get getSearchFormControls() {
    return this.searchForm.controls;
  }

  ngOnInit(): void {
    this.toolbarStateService.changeCurrentlyActive(4);

    this.orderService.getAllOrders()
      .subscribe(data => {
        this.orders = data.orders;
      }, error => {
        this.alertService.openSnackBar(`Failed to get the orders!`, true);
      });

    this.searchForm = this.formBuilder.group({
      term: ['']
    });
  }

  onSearchSubmit() {
    this.submittedSearch = true;

    const query = this.searchForm.controls.term.value;
    if (query === '' || query === null || query === undefined) {
      console.log('query is empty');
      this.orderService.getAllOrders()
        .subscribe(data => {
          this.orders = data.orders;
        }, error => {
          this.alertService.openSnackBar(`Failed to get the orders!`, true);
        });
    } else {
      console.log('seraching for', query);
      this.orderService.searchOrders(query)
        .subscribe(data => {
          this.orders = data.orders;
        }, error => {
          this.alertService.openSnackBar(`Failed to search orders!`, true);
        });
    }

    this.submittedSearch = false;
    this.searchForm.reset();
  }

  ready(item: Order) {
    this.orderService.ready(item.orderId.id)
      .subscribe(data => {
        const index = this.orders.findIndex(x => x.orderId.id === item.orderId.id);
        if (index > -1) {
          this.orders[index].status = 'READY';
        }
      }, error => {
        this.alertService.openSnackBar(`Failed to search orders!`, true);
      });

  }

  delivering(item: Order) {
    this.orderService.pickUp(item.orderId.id)
      .subscribe(data => {
        const index = this.orders.findIndex(x => x.orderId.id === item.orderId.id);
        if (index > -1) {
          this.orders[index].status = 'DELIVERING';
        }
      }, error => {
        this.alertService.openSnackBar(`Failed to search orders!`, true);
      });
  }

  delivered(item: Order) {
    this.orderService.delivered(item.orderId.id)
      .subscribe(data => {
        const index = this.orders.findIndex(x => x.orderId.id === item.orderId.id);
        if (index > -1) {
          this.orders[index].status = 'DELIVERED';
        }
      }, error => {
        this.alertService.openSnackBar(`Failed to search orders!`, true);
      });
  }
}
