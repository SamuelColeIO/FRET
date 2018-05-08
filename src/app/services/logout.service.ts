import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LogoutService {
  constructor(private http: Http) { }

  submitLogout(): Observable<any> {
    return this.http.get('/api/v1/logout')
      .map((res: any) => res.text())
  }
}