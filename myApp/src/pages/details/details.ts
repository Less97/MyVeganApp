import { Component } from '@angular/core';
import { NavController ,NavParams } from 'ionic-angular';
import { Place } from '../../entities/place';

import { ImageHelper } from '../../helpers/imageHelper'
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';

import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Geolocation } from '@ionic-native/geolocation';



@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})

export class DetailsPage {
  place:Place;
  position:{
    latitude:number,
    longitude:number
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private imageHelper:ImageHelper,private callNumber: CallNumber, 
  private emailComposer: EmailComposer,private geolocation: Geolocation,
  private launchNavigator: LaunchNavigator) {
    this.place = navParams.get("place") as Place;
  }

  ionViewDidLoad(){
    this.geolocation.getCurrentPosition().then((resp) => {
    this.position.latitude = resp.coords.latitude;
    this.position.longitude = resp.coords.longitude;
    // resp.coords.longitude
  }).catch((error) => {
    console.log('Error getting location', error);
  });
  }

  getImageIcon(type:string):string{
    return ImageHelper.GetImageListSrc(type);
  }

   getDistance(distance):number {
      return distance / 1000;
  }

  getDirection():void{
    let options: LaunchNavigatorOptions = {
      start: this.position.latitude+','+this.position.longitude,
    };
    this.launchNavigator.navigate([this.position.latitude,this.position.longitude],options)
  }

  toGallery(){
      this.navCtrl.push(DetailsPage,{placeId:this.place._id,imageIds:this.place.imageIds})
  }

  sendEmail(){
    let email = {
    to: this.place.email,
    subject: '',
    body: 'Hi '+ this.place.name+',<br/><p>I wanted to book a table for ...</p>',
    isHtml: true
    };
    this.emailComposer.open(email);
  }


  call(number:string){
   this.callNumber.callNumber(this.place.phoneNumber, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }
}
