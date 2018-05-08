import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

@Injectable()
export class TestService {
	constructor(private http: Http) { }

	test(post): Observable<any> {
    let options = "";
		return this.http.get('https://jsonplaceholder.typicode.com/posts/' + post, options)
			.map((res: Response) => res.json())
			.catch((err: any) => Observable.throw(err));
	}
}