import {Component, OnInit} from '@angular/core';
import {Order} from '../_models/order/Order';
import {MatTableDataSource} from '@angular/material/table';
import {OrderService} from '../_services/order.service';
import {interval} from 'rxjs';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  public order: Order;
  orderStatus: number;
  subscription: any;

  displayedColumns = ['name', 'quantity', 'cost', 'totalCost'];
  public dataSource = new MatTableDataSource();

  constructor(private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.dataSource.data = this.order.orderItems;

    this.orderService.getOrderStatus(this.order.orderId.id)
      .subscribe(data => {
        console.log('obtained normal status', data.status);
        console.log(JSON.stringify(data));
        this.orderStatus = data.status;
      });

    this.startPooling();

  }

  startPooling(): void {
    this.subscription = interval(5000).subscribe(x =>
      this.orderService.getOrderStatus(this.order.orderId.id)
        .subscribe(data => {
          console.log('obtained scheduled status', data.status);
          console.log(JSON.stringify(data));
          this.orderStatus = data.status;
        })
    );
  }

}
