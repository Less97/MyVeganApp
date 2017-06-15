 import { Injectable } from '@angular/core';
 import { SearchSettings } from '../entities/searchSettings'
 import { Tag  } from '../entities/tag'
 import { UserData } from '../entities/userData' ;

 import 'rxjs/add/operator/map';

 @Injectable()
 export class ConfigsProvider {

   public serviceURL: string = 'http://thecuriouscarrot.com/api/'
   //public serviceURL = "http://localhost:51067/api/";


   constructor() {

   }

   isLoggedIn(): boolean {
      return this.getUserData().isLoggedIn;
   }

   getServiceUrl(): string {
     return this.serviceURL;
   }

   saveSearchSettings(searchData:SearchSettings): void {
     window.localStorage.setItem('searchSettings', JSON.stringify(searchData));
   }

   getSearchSettings(): SearchSettings {
     var data = JSON.parse(window.localStorage.getItem('searchSettings'));
     if (data == null) {
       return new SearchSettings(250, new Array<Tag>())
     }
     return data as SearchSettings;
   }

   saveUserData(userData:UserData):void{
    window.localStorage.setItem('userData', JSON.stringify(userData));
   }

   getUserData():UserData{
     var obj = window.localStorage.getItem('userData');
     if(obj==null||obj==undefined) return new UserData();
     return  JSON.parse(window.localStorage.getItem('userData')) as UserData;
   }

 }
