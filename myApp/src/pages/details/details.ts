import { Component } from '@angular/core';
import { NavController ,NavParams } from 'ionic-angular';
import { Place } from '../../entities/place';

import { ImageHelper } from '../../helpers/imageHelper'
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';



@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})

export class DetailsPage {
  place:Place;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private imageHelper:ImageHelper,private callNumber: CallNumber, private emailComposer: EmailComposer) {
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

  sendEmail(){
    let email = {
    to: this.place.email,
    bcc: ['john@doe.com', 'jane@doe.com'],
  
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
