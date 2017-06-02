 import { Injectable } from  '@angular/core';
 import { ConfigsProvider } from '../providers/configsProvider'
 import { Http } from '@angular/http'
 import { PlaceBase } from '../entities/placeBase'
 import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  private serviceUrl:string;

  constructor(private http: Http, private configs:ConfigsProvider) {
    this.serviceUrl = configs.serviceURL+'users/login';
  }
  

  public getPlacesBases(lat:number,lng:number):Observable<Array<PlaceBase>>{
     return new Observable<Array<PlaceBase>>();
  }

  // private handleError(error: any): Promise<any> {
  //   console.error('An error occurred', error); // for demo purposes only
  //   return Promise.reject(error.message || error);
  // }
}