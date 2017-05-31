 import {Injectable} from  '@angular/core';
 //import {Http} from '@angular/http'

import 'rxjs/add/operator/map';

@Injectable()
export class ConfigsProvider {
  
  public serviceURL:String = 'http://thecuriouscarrot.com/api/'
  //var address = "http://localhost:51067/api/";
  
  constructor() {

  }

  

}
