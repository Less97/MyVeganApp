
export class PlaceBase{
  _id: string;
  name:string;
  type:string;
  rating:number;
  reviews:number;
  position:{
    latitude:number,
    longitude:number  
  }

  static build(_id:string, name:string, type:string, reviews:number,rating:number, latitude:number, longitude:number):PlaceBase{
    var pb = new PlaceBase();
    pb._id =_id;
    pb.name = name;
    pb.type = name;
    pb.reviews = reviews;
    pb.rating = rating
    pb.position.latitude = latitude;
    pb.position.longitude = longitude
    return pb;
  }
}