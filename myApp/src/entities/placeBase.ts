
export class PlaceBase{
  _id: string;
  name:string;
  type:string;
  review:number;
  position:{
    latitude:number,
    longitude:number  
  }
}