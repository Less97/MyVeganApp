
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
  };
  imageIds:string[];
  distance:number;
  address:string;
  phoneNumber:string;
  email:string;

  static build(_id:string, name:string,description:string,address:string,phoneNumber:string,email:string, type:string, reviews:number,rating:number,openingHour:string[], latitude:number, longitude:number,distance:number,imageIds:string[]):Place{
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
    pb.imageIds = imageIds;
    pb.address = address
    pb.phoneNumber = phoneNumber;
    pb.email = email;
    return pb;
  }

  static calculateLabel(distance:number):string{
    return distance.toString();
  }
}