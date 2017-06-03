

export class ImageHelper{

    constructor(){

    }

    public static GetImageListSrc(type:string):string{
         switch(type){
          case "restaurant":
             return "assets/placeTypes/list/restaurant.png";
          case "cafe":
             return "assets/placeTypes/list/cafe.png";
          case "shop":
             return "assets/placeTypes/list/shop.png";
          case "food truck":
            return "assets/placeTypes/list/foodtruck.png";
          case "takeaway":
             return "assets/placeTypes/list/takeaway.png"
          case "market":
            return ""
        }
    }

    public static GetImageMapSrc(type:string):string{
         switch(type){
          case "restaurant":
            return "assets/placeTypes/pins/restaurant.png";
          case "cafe":
            return "assets/placeTypes/pins/cafe.png";
          case "shop":
            return "assets/placeTypes/pins/shop.png";
          case "food truck":
            return "assets/placeTypes/pins/foodtruck.png";
          case "takeaway":
            return "assets/placeTypes/pins/takeaway.png"
          case "market":
            return ""
        }
    }
}