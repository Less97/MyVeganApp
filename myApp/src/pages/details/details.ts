import { Component } from '@angular/core';
import { NavController ,NavParams } from 'ionic-angular';
import { Place } from '../../entities/place';

import { ImageHelper } from '../../helpers/imageHelper'



@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})

export class DetailsPage {
  place:Place;
  constructor(public navCtrl: NavController, public navParams: NavParams,private imageHelper:ImageHelper) {
    this.place = navParams.get("place") as Place;
  }

  getImageIcon(type:string):string{
    return ImageHelper.GetImageListSrc(type);
  }

   getDistance(distance):number {
      return distance / 1000;
  }

  getDirection():void{
    alert("getDirection")
  }

  toGallery(){
      this.navCtrl.push(DetailsPage,{placeId:this.place._id,imageIds:this.place.imageIds})
  }

  call(number:string){
    alert("call number "+ number )
  }
}
