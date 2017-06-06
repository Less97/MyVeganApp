import { Component } from '@angular/core';
import { NavController ,NavParams, ViewController  } from 'ionic-angular';
import { Place } from '../../entities/place';

import { ImageHelper } from '../../helpers/imageHelper'



@Component({
  selector: 'page-detailsPage',
  templateUrl: 'details.html'
})

export class DetailsPage {
  place:Place;
  constructor(public navCtrl: NavController, public navParams: NavParams,private imageHelper:ImageHelper) {
    this.place = navParams.get("place") as Place;
  }

 getImageCover(type:string):string{
    return ImageHelper.GetImageCoverSrc(type);
  }

}
