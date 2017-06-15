import { Tag } from './tag'

export class SearchSettings {
    maxDistance:number;
    tags:Tag[];
    constructor(distance:number,tags:Array<Tag>){
        this.maxDistance = distance;
        this.tags = tags;
    }
    
}