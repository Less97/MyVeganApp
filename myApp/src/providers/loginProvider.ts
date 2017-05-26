import {Injectable} from  '@angular/core';
import {Http} from '@angular/http'

import 'rxjs/add/operator/map';

@Injectable()
export class LoginProvider {

  constructor() {

  }

  isLoggedIn(){
    return true;
  }

  login(){
     return new Promise((r)=>{
        setTimeout(()=>{
            Promise.resolve(true)
        },3000)
     })
  }
}
