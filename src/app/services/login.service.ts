import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoginService {
  constructor(private http: Http, private window: Window) { }

  submitLogin(email, password): Observable<any> {
    let options = "";
    return this.http.post('/api/v1/login', { email: email, password: password }, options)
      .map((res: any) => res.json())
  }

  getCurrentUser() {
    let window: any = this.window; 
    if(window.currentUser) {
      return JSON.parse(window.currentUser);
    } else {
      return null;
    }
  }

  updateCurrentUser(user) {
    let window: any = this.window; 
    window.currentUser = JSON.stringify(user);
  } 

  checkGoogleAccessToken(token) {
    return this.http.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`)
      .map((res: any) => res.json())
  }

  refreshGoogleAccessToken() {
    return this.http.get('/api/v1/refresh-google-access-token')
      .map((res: any) => res.json())
  }
}