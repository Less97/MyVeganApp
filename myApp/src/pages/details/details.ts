import { Component } from '@angular/core';
import { NavController ,NavParams, ViewController  } from 'ionic-angular';
import { Place } from '../../entities/place'



@Component({
  selector: 'page-detailsPage',
  templateUrl: 'details.html'
})

export class DetailsPage {
  place:Place;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.place = navParams.get("place") as Place;
  }


}
