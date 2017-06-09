
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
  distance:number;

  static build(_id:string, name:string,description:string, type:string, reviews:number,rating:number, latitude:number, longitude:number,distance:number):Place{
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
    pb.distance = distance;
    return pb;
  }

  static calculateLabel(distance:number):string{
    return (distance/1000).toFixed(2);
  }
}