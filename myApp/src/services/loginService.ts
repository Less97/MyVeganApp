 import {Injectable} from  '@angular/core';
 import { ConfigsProvider } from '../providers/configsProvider'
 //import {Http} from '@angular/http'

import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  constructor() {

  }
  

  login(){
     return new Promise((r)=>{
        setTimeout(()=>{
            Promise.resolve(true)
        },3000)
     })
  }
}
