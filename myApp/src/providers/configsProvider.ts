 import {
   Injectable
 } from '@angular/core';
 import {
   SearchSettings
 } from '../entities/searchSettings'
 import {
   Tag
 } from '../entities/tag'
 //import {Http} from '@angular/http'

 import 'rxjs/add/operator/map';

 @Injectable()
 export class ConfigsProvider {

   public serviceURL: string = 'http://thecuriouscarrot.com/api/'
   //public serviceURL = "http://localhost:51067/api/";

   constructor() {

   }

   isLoggedIn(): boolean {
     return false;
   }

   getServiceUrl(): string {
     return this.serviceURL;
   }

   saveSearchSettings(data): void {
     window.localStorage.setItem('searchSettings', data.json());
   }

   getSearchSettings(): SearchSettings {
     var data = JSON.parse(window.localStorage.getItem('searchSettings'));
     if (data == null) {
       return new SearchSettings(250, new Array<Tag>())
     }
     return data as SearchSettings;
   }

   saveUserData(userData):void{
    window.localStorage.setItem('userData', userData.json());
   }

 }
