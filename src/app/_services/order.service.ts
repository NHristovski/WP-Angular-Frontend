import {Injectable} from '@angular/core';
import {Constants} from '../_helpers/constants';
import {HttpClient} from '@angular/common/http';
import {GetOrdersResponse} from '../_models/_value/response/GetOrdersResponse';
import {GetOrderStatusResponse} from '../_models/_value/response/GetOrderStatusResponse';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersApiUrl = Constants.baseApiUrl + '/orders';

  constructor(private http: HttpClient) {
  }

  getOrders() {
    return this.http.get<GetOrdersResponse>(this.ordersApiUrl);
  }

  getOrderStatus(id: string) {
    console.log('called get order status with id ', id);
    return this.http.get<GetOrderStatusResponse>(`${this.ordersApiUrl}/${id}/status`);
  }

  getAllOrders() {
    return this.http.get<GetOrdersResponse>(`${this.ordersApiUrl}/admin/all`);
  }

  searchOrders(query: string) {
    return this.http.get<GetOrdersResponse>(`${this.ordersApiUrl}/admin/search/${query}`);
  }

  delivered(id: string) {
    return this.http.post(`${this.ordersApiUrl}/delivered/${id}`, null);
  }

  pickUp(id: string) {
    return this.http.post(`${this.ordersApiUrl}/pickUp/${id}`, null);
  }

  ready(id: string) {
    return this.http.post(`${this.ordersApiUrl}/ready/${id}`, null);
  }
}
