 import { Injectable } from  '@angular/core';
 import { ConfigsProvider } from '../providers/configsProvider'
 import { Http } from '@angular/http'
 import { Place } from '../entities/place'
 import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise'
import 'rxjs/add/operator/map';

@Injectable()
export class PlaceService {

  private serviceUrl:string;

  constructor(private http: Http, private configs:ConfigsProvider) {
    this.serviceUrl = configs.serviceURL+'places/getplaces';
  }
  

  public getPlaces(lat:number,lng:number):any{
    let params: URLSearchParams = new URLSearchParams();
      params.set('latitude', '53.3421156');
      params.set('longitude', '-9.2592088');
      params.set('maxDistance', '53.3421156');
      params.set('searchText', '');
      params.set('tags', '');
     return this.http.get(this.serviceUrl,params)
      .map(res=>{return JSON.parse(res.json()).map(t=>  Place.build(t._id.oid,t.name,t.type,t.nReviews,t.rating,t.location.coordinates[0],t.location.coordinates[1]))
      })
    }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}