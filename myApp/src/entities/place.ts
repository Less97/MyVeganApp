
export class Place{
  _id: string;
  name:string;
  type:string;
  rating:number;
  reviews:number;
  description:string;
  position:{
    latitude:number,
    longitude:number
  }

  static build(_id:string, name:string,description:string, type:string, reviews:number,rating:number, latitude:number, longitude:number):Place{
    var pb = new Place();
    pb._id =_id;
    pb.name = name;
    pb.type = type;
    pb.reviews = reviews;
    pb.rating = rating;
    pb.description = description;
    pb.position = {
      latitude : latitude,
      longitude : longitude
    };
    
    return pb;
  }
}