import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AddProductToShoppingCartRequest} from '../_models/shoppingCart/addProductToShoppingCartRequest';
import {Observable} from 'rxjs';
import {BuyRequest} from '../_models/shoppingCart/buyRequest';
import {Constants} from '../_helpers/constants';
import {ShoppingCartId} from '../_models/_value/shoppingCart/ShoppingCartId';
import {ShoppingCartItemId} from '../_models/_value/shoppingCart/ShoppingCartItemId';


@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private apiUrl = Constants.baseApiUrl + '/shopping-cart';

  // private apiUrl = 'https://wp-api-gateway.herokuapp.com/product';

  constructor(private http: HttpClient) {
  }

  addProductToCart(id: string, quantity: number) {
    const request = new AddProductToShoppingCartRequest();
    request.productId = id;
    request.quantity = quantity;

    return this.http.post(`${this.apiUrl}/shoppingCart/`, request);
  }

  getShoppingCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/shopping_cart`);
  }

  getShoppingCartHistory(): Observable<any> {

    return this.http.get(`${this.apiUrl}/shoppingCart/history`);
  }

  incrementQuantity(shoppingCartId: ShoppingCartId, shoppingCartItemId: ShoppingCartItemId) {
    return this.http.put(
      `${this.apiUrl}/shopping_cart/${shoppingCartId.id}/item/${shoppingCartItemId.id}/increment`, null
    );
  }

  decrementQuantity(shoppingCartId: ShoppingCartId, shoppingCartItemId: ShoppingCartItemId) {
    return this.http.put(
      `${this.apiUrl}/shopping_cart/${shoppingCartId.id}/item/${shoppingCartItemId.id}/decrement`, null
    );
  }

  delete(cartId: ShoppingCartId, itemId: ShoppingCartItemId) {
    return this.http.delete(`${this.apiUrl}/shopping_cart/delete/${cartId.id}/${itemId.id}`);
  }

  buy(buyReq: BuyRequest) {
    console.log('in buy service');
    return this.http.post(`${this.apiUrl}/shoppingCart/buy`, buyReq);
  }
}
