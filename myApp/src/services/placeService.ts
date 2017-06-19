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
  }
  
  public getPlaces(lat:number,lng:number):Observable<Place[]>{
      let searchSettings = this.configs.getSearchSettings();
      let params: URLSearchParams = new URLSearchParams();
      let requestOptions = new RequestOptions();
      params.set('latitude', lat.toString());
      params.set('longitude', lng.toString());
      params.set('maxDistance',searchSettings.maxDistance.toString() );
      params.set('searchText', '');
      var selectedTags = searchSettings.tags.filter(x=>x.selected==true).map(t=>t._id).join(',')
      params.set('tags', selectedTags);
      requestOptions.search = params;
     return this.http.get(this.configs.serviceURL+'places/getplaces',requestOptions)
      .map(res=>{
        return JSON.parse(res.json()).map(t=>  
        Place.build(t._id.$oid,t.name,t.description,t.address,t.phoneNumber,t.email,t.type,t.nReviews,t.rating,t.openingHours,t.location.coordinates[1],t.location.coordinates[0],t.distance,t.gallery))
      })
    }

  public getDetails(id:string,lat:number,lng:number):Observable<Place>{
    let params: URLSearchParams = new URLSearchParams();
    let requestOptions = new RequestOptions();
    params.set('latitude', lat.toString());
    params.set('longitude', lng.toString());
    params.set('placeId', id);
    requestOptions.search = params;
    return this.http.get(this.configs.serviceURL + 'places/getPlaceDetails',requestOptions).map(res=>{
      var t = JSON.parse(res.json());
      return Place.build(t._id.$oid,t.name,t.description,t.address,t.phoneNumber,t.email,t.type,t.nReviews,t.rating,t.openingHours,t.location.coordinates[1],t.location.coordinates[0],t.distance,t.gallery);
    })
  }

  public getImgSource(imgId:string){
    return this.configs.serviceURL+'images/get?imgId='+imgId;
  }
 
}