import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../_helpers/constants';
import {GetAllCategoriesResponse} from '../_models/_value/response/GetAllCategoriesResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = Constants.baseApiUrl + '/product'; // 'https://wp-api-gateway.herokuapp.com/product';

  constructor(private http: HttpClient) {
  }

  getAllCategories() {
    return this.http.get<GetAllCategoriesResponse>(`${this.apiUrl}/category`);
  }

}
