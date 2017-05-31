 import {Injectable} from  '@angular/core';
 import { ConfigsProvider } from '../providers/configsProvider'
 import { Http } from '@angular/http'
 import { UserData } from '../entities/UserData'
 import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  private serviceUrl:string;

  constructor(private http: Http, private configs:ConfigsProvider) {
    this.serviceUrl = configs.serviceURL;
  }
  

  public login(eml:string,pwd:string):Promise<UserData>{
     return this.http.post(this.serviceUrl,{email:eml,pwd})
       .toPromise()
       .then(res=>res.json().data as UserData)
       .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
