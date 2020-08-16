import {Injectable} from '@angular/core';
import {Constants} from '../_helpers/constants';
import {HttpClient} from '@angular/common/http';
import {BuyRequest} from '../_models/shoppingCart/buyRequest';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentApiUrl = Constants.baseApiUrl + '/payment';

  constructor(private http: HttpClient) {
  }

  charge(buyRequest: BuyRequest) {
    return this.http.post(`${this.paymentApiUrl}/payment/charge`, buyRequest);
  }

  test() {
    return this.http.get(`${this.paymentApiUrl}/payment/test`);
  }
}
