

export class ImageHelper{

    constructor(){

    }

    public static GetImageListSrc(type:string):string{
         switch(type){
          case "restaurant":
             return "assets/images/placeTypes/list/restaurant.png";
          case "cafe":
             return "assets/images/placeTypes/list/cafe.png";
          case "shop":
             return "assets/images/placeTypes/list/shop.png";
          case "food truck":
            return "assets/images/placeTypes/list/foodtruck.png";
          case "takeaway":
             return "assets/images/placeTypes/list/takeaway.png"
          case "pizzeria":
             return "assets/images/placeTypes/list/pizza.png"
          case "market":
            return ""
        }
    }

    public static GetImageMapSrc(type:string):string{
         switch(type){
          case "restaurant":
            return "assets/images/placeTypes/pins/restaurant.png";
          case "cafe":
            return "assets/images/placeTypes/pins/cafe.png";
          case "shop":
            return "assets/images/placeTypes/pins/shop.png";
          case "food truck":
            return "assets/images/placeTypes/pins/foodtruck.png";
          case "takeaway":
            return "assets/images/placeTypes/pins/takeaway.png";
          case "pizzeria":
            return "assets/images/placeTypes/pins/pizza.png"
          case "market":
            return ""
        }
    }

     public static GetImageCoverSrc(type:string):string{
         switch(type){
          case "restaurant":
             return "assets/images/placeTypes/covers/restaurant.jpg";
          case "cafe":
             return "assets/images/placeTypes/covers/coffee.jpg";
          case "shop":
             return "assets/images/placeTypes/covers/shop.jpg";
          case "food truck":
            return "assets/images/placeTypes/covers/foodtruck.jpg";
          case "takeaway":
             return "assets/images/placeTypes/covers/takeaway.jpg"
          case "pizza":
            return "assets/images/placeTypes/covers/pizza.jpg"
          case "market":
            return ""
        }
    }
}