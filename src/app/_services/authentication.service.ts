import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {User} from '../_models';
import {Constants} from '../_helpers/constants';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private apiUrl = Constants.baseApiUrl; // 'https://wp-api-gateway.herokuapp.com';

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username, password) {
    console.log('in login');
    return this.http.post<any>(`${this.apiUrl}/auth/`, {username, password}, {observe: 'response'})
      .pipe(map(resp => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        const currUser = new User();
        currUser.token = resp.headers.get('Authorization');
        currUser.roles = resp.headers.get('roles');
        currUser.id = resp.headers.get('id');

        currUser.username = username;

        console.log('current user: ', currUser);

        localStorage.setItem('currentUser', JSON.stringify(currUser));

        this.currentUserSubject.next(currUser);
        return currUser;
      }));

  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  hasAdminRole() {
    const roles = this.currentUserValue.roles;

    console.log('curr user roles: ', roles);

    return roles.includes('ROLE_ADMIN');
  }

  getCurrentUserId() {
    return this.currentUserValue.id;
  }
}
