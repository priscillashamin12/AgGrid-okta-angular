import { HttpBackend, HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { UserCredential } from '../models/user-credential';
const LOGIN_URL = '/api/login';
const CURRENT_USER = 'userId';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private httpClient: HttpClient, handler: HttpBackend) {
    /**
     * A final `HttpHandler` which will dispatch the request via browser HTTP APIs
     * directly to the backend, without going through the interceptor chain.
     */
    // this.httpClient = new HttpClient(handler);
  }
  /**
   * Validates the comcast user credential against the DB and then LDAP.
   * @param {UserCredential} userCredential - credentials entered by the user.
   * @returns {HttpResponse} - HTTP response for login request.
   */
  login(userCredential: UserCredential): Observable<any> {
    return this.httpClient
      .post(LOGIN_URL, userCredential, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        }),
      )
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            return Observable.throw(
              'Your username or password is incorrect or you may not have the access permission!',
            );
          } else {
            return Observable.throw(
              'Connection lost to the server, please contact your administrator!',
            );
          }
        }),
      );
  }

  /**
   * Saving the logged user Information in a local storage.
   */
  saveUserInfo(userinfo) {
    const loggedUserInfo = JSON.stringify(userinfo);
    localStorage.setItem(CURRENT_USER, loggedUserInfo);
    // Need to write the User Info DB Saving code Here
  }

  /**
   * Retreving the logged in user Information .
   */
  getAuthenticatedUser() {
    const current_user = localStorage.getItem(CURRENT_USER);
    return JSON.parse(current_user);
  }
}
