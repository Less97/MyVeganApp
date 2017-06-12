 import { Injectable } from  '@angular/core';
 import { ConfigsProvider } from '../providers/configsProvider'
 import { Http, RequestOptions, URLSearchParams  } from '@angular/http'
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
  
  public getPlaces(lat:number,lng:number):Observable<Place[]>{
      let params: URLSearchParams = new URLSearchParams();
      let requestOptions = new RequestOptions();
      params.set('latitude', lat.toString());
      params.set('longitude', lng.toString());
      params.set('maxDistance', '300');
      params.set('searchText', '');
      params.set('tags', '');
      requestOptions.search = params;
     return this.http.get(this.serviceUrl,requestOptions)
      .map(res=>{
        return JSON.parse(res.json()).map(t=>  
        Place.build(t._id.$oid,t.name,t.description,t.type,t.nReviews,t.rating,t.location.coordinates[1],t.location.coordinates[0],t.distance,t.gallery))
      })
    }
 
}