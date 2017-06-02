import { Injectable } from  '@angular/core';
import { Tag } from '../entities/tag'
import { Http } from '@angular/http'
import { ConfigsProvider } from '../providers/configsProvider'

import { Observable } from 'rxjs/Rx';

@Injectable()
export class TagsService{

    tagsUrl:string;
    constructor(public http:Http,public configsProvider:ConfigsProvider){
        this.tagsUrl = configsProvider.getServiceUrl()+'tags/getTags'
    }

    getTags():Observable<Tag[]>{
        return this.http.get(this.tagsUrl).map(res=>{return JSON.parse(res.json()).map(x=>new Tag(x._id)) });
    }

}