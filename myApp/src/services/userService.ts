 import { Injectable } from  '@angular/core';
 import { ConfigsProvider } from '../providers/configsProvider'
 import { Http } from '@angular/http'
 import { UserData } from '../entities/userData'
 import { CodeResponse } from '../entities/messages/codeResponse';
 import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private serviceUrl:string;

  constructor(private http: Http, private configs:ConfigsProvider) {
    this.serviceUrl = configs.serviceURL;
  }
  

  public login(eml:string,pwd:string):Observable<UserData>{
     return this.http.post(this.serviceUrl+'users/login',{email:eml,password:pwd})
     .map(res=> new UserData().fromResponse(res.json()))
  }

  public register(name:string,surname:string,eml:string,password:string):Observable<CodeResponse>{
    return this.http.post(this.serviceUrl+'users/createUser',{
      firstName: name,
      lastName: surname,
      email: eml,
      password: password,
      type:0
    }).map(res=>new CodeResponse().fromResponse(res.json()))
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('An error occurred', error); // for demo purposes only
  //   return Promise.reject(error.message || error);
  // }
}
