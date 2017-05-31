 import {Injectable} from  '@angular/core';
 //import {Http} from '@angular/http'

import 'rxjs/add/operator/map';

@Injectable()
export class ConfigsProvider {
  
  public serviceURL:string = 'http://thecuriouscarrot.com/api/'
  //public serviceURL = "http://localhost:51067/api/";
  
  constructor() {

  }

  isLoggedIn():boolean{
    return false;
  }

  getServiceUrl():string{
    return this.serviceURL;
  }

}
