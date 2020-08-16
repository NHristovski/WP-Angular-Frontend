import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AddProductRequest} from '../_models';
import {Observable} from 'rxjs';
import {Constants} from '../_helpers/constants';
import {AuthenticationService} from './authentication.service';
import {EditProductRequest} from '../_models/message/request/EditProductRequest';
import {ProductId} from '../_models/_value/product/ProductId';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productApiUrl = Constants.baseApiUrl + '/product';
  private ratingApiUrl = Constants.baseApiUrl + '/ratings';

  // private productApiUrl = 'https://wp-api-gateway.herokuapp.com/product';

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) {
  }

  addProduct(product: AddProductRequest) {
    return this.http.post(`${this.productApiUrl}/product/add_product`, product);
  }

  getAllProducts(page: number, size: number) {
    return this.http.get(`${this.productApiUrl}/product?page=${page}&size=${size}`);
  }

  rateProduct(productId: string, currentRate: number): Observable<any> {
    const rateRequest = {
      productId,
      applicationUserId: this.authenticationService.getCurrentUserId(),
      rating: currentRate
    };
    return this.http.post(`${this.ratingApiUrl}/ratings/rate`, rateRequest);
  }

  getProduct(id: ProductId): Observable<any> {
    return this.http.get(`${this.productApiUrl}/product/${id.id}`);
  }

  getAllProductsForCategory(page: number, size: number, categoryId: string) {
    return this.http.get(`${this.productApiUrl}/product/in_category/${categoryId}?page=${page}&size=${size}`);
  }

  getTopRatedProducts(page: number, size: number) {
    return this.http.get(`${this.productApiUrl}/product/top_rated?page=${page}&size=${size}`);
  }

  editProduct(request: EditProductRequest, id: string) {
    return this.http.put(`${this.productApiUrl}/product/edit_product`, request);
  }
}
