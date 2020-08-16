import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {RegisterRequest} from '../_models';
import {Constants} from '../_helpers/constants';

@Injectable({providedIn: 'root'})
export class UserService {

  private apiUrl = Constants.baseApiUrl;
  // private apiUrl = 'https://wp-api-gateway.herokuapp.com';


  constructor(private http: HttpClient) {
  }

  register(registerRequest: RegisterRequest) {
    console.log('posting user');

    return this.http.post(`${this.apiUrl}/users/public/register`, registerRequest);
  }


}
