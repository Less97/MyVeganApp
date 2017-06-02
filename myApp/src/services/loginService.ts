 import { Injectable } from  '@angular/core';
 import { ConfigsProvider } from '../providers/configsProvider'
 import { Http } from '@angular/http'
  import { UserData } from '../entities/userData'
 import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  private serviceUrl:string;

  constructor(private http: Http, private configs:ConfigsProvider) {
    this.serviceUrl = configs.serviceURL+'users/login';
  }
  

  public login(eml:string,pwd:string):Observable<UserData>{
     return this.http.post(this.serviceUrl,{email:eml,password:pwd})
     .map(res=> new UserData().fromResponse(res.json()))
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('An error occurred', error); // for demo purposes only
  //   return Promise.reject(error.message || error);
  // }
}
