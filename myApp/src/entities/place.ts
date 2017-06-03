
export class Place{
  _id: string;
  name:string;
  type:string;
  rating:number;
  reviews:number;
  position:{
    latitude:number,
    longitude:number
  }

  static build(_id:string, name:string, type:string, reviews:number,rating:number, latitude:number, longitude:number):Place{
    var pb = new Place();
    pb._id =_id;
    pb.name = name;
    pb.type = type;
    pb.reviews = reviews;
    pb.rating = rating
    pb.position = {
      latitude : latitude,
      longitude : longitude
    };
    
    return pb;
  }
}