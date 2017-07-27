
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
  distance:number;
  address:string;
  phoneNumber:string;
  openingHours:string[];
  email:string;
  gallery:string[];
  website:string,
  tags:string[];

  static build(_id:string, name:string,description:string,address:string,phoneNumber:string,email:string, type:string, reviews:number,rating:number,openingHours:string[], latitude:number, longitude:number,distance:number,gallery:string[],tags:string[],website:string):Place{
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
    pb.gallery = gallery.map(x=>(x as any).$oid as string);
    pb.address = address
    pb.phoneNumber = phoneNumber;
    pb.email = email;
    pb.openingHours = openingHours;
    pb.tags = tags;
    return pb;
  }

  static calculateLabel(distance:number):string{
    return distance.toString();
  }
}