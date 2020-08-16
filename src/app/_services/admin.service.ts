import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../_helpers/constants';
import {AddCategoryRequest} from '../_models/message/request/AddCategoryRequest';
import {Name} from '../_models/_value/Name';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = Constants.baseApiUrl + '/product';

  constructor(private http: HttpClient) {
  }

  test() {
    return this.http.get(`${this.apiUrl}`);
  }

  addCategory(name: string) {
    const request = new AddCategoryRequest();
    const nameObj = new Name();
    nameObj.name = name;

    request.categoryName = nameObj;

    return this.http.post(`${this.apiUrl}/category/add_category`, request);
  }

  deleteCategory(id: string) {
    return this.http.delete(`${this.apiUrl}/category/delete_category/${id}`);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.apiUrl}/product/delete_product/${id}`);
  }

  search(value: string) {
    return this.http.get(`${this.apiUrl}/product/search/${value}`);
  }

  refresh(id: string) {
    return this.http.put(`${this.apiUrl}/product/refresh/${id}`, null);
  }
}
