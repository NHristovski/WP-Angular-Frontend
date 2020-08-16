import {Injectable} from '@angular/core';
import {Constants} from '../_helpers/constants';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersApiUrl = Constants.baseApiUrl + '/orders';

  constructor(private http: HttpClient) {
  }

  getOrders() {
    return this.http.get(this.ordersApiUrl);
  }

  getOrderStatus(id: string) {
    console.log('called get order status with id ', id);
    return this.http.get(`${this.ordersApiUrl}/${id}/status`);
  }
}
