import {Injectable} from '@angular/core';
import {Constants} from '../_helpers/constants';
import {HttpClient} from '@angular/common/http';
import {RestockRequest} from '../_models/message/request/RestockRequest';
import {ProductId} from '../_models/_value/product/ProductId';
import {Price} from '../_models/_value/product/Price';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private inventoryApiUrl = Constants.baseApiUrl + '/inventory';

  constructor(private http: HttpClient) {
  }

  restock(id: string, newStock: number) {
    const restockRequest: RestockRequest = {
      productId: id,
      stock: {
        quantity: newStock
      }
    };
    return this.http.put(`${this.inventoryApiUrl}/restock/${id}`, restockRequest);
  }

  verifyStock(productId: ProductId, quantity: number, price: Price, productName: string) {
    const checkStockRequest = {
      productId,
      stock: quantity,
      price,
      productName: {
        name: productName
      }
    };
    return this.http.post(`${this.inventoryApiUrl}/check_stock/${productId.id}`, checkStockRequest);
  }
}
