
import { Headers, Http } from '@angular/http';
import { Injectable }    from '@angular/core';
import { User } from '../entities/user'

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService {

  // private address = 'http://thecuriouscarrot.com/api/';
  // private headers = new Headers({ 'Content-Type': "application/json"});
  // constructor(private http: Http){}

  // Login(eml, pwd) : Promise<User> {
  //    var req = {
  //         url: this.address + "users/login",
  //         data: {
  //           email: eml,
  //           password: pwd
  //         },
  //       }
  //       return this.http.post(req.url,JSON.stringify(req.data),this.headers)
  //       .toPromise()
  //       .then(response=>response.json().data as User)
  //       .catch(()=>{
  //         return Promise.reject("Problem connecting to the service")
  //       })
  // }

  // IsLogged() {
  //   var data = JSON.parse(window.localStorage.getItem('loginData'));
  //   if (data == null)
  //     return false;
  //   return data.isLoggedIn;
  // }
  // Logout() {
  //   window.localStorage.setItem('loginData', '');
  // }

}
