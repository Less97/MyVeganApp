import { Component } from '@angular/core';
import { NavController ,NavParams } from 'ionic-angular';
import { Place } from '../../entities/place';
import { CallNumber } from '@ionic-native/call-number';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { ImageHelper } from '../../helpers/imageHelper'
import { Geolocation } from '@ionic-native/geolocation';
import { EmailComposer } from '@ionic-native/email-composer';
import { PlaceService } from '../../services/placeService'
import { LoadingController,Loading } from 'ionic-angular';


@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})

export class DetailsPage {
  placeId:string;
  place:Place;
  loader:Loading;
  position:{latitude:number,longitude:number} = {latitude:0,longitude:0};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private imageHelper:ImageHelper,private geolocation: Geolocation, 
    private callNumber: CallNumber,private launchNavigator: LaunchNavigator,private emailComposer: EmailComposer,private placeService:PlaceService,private loadingCtrl:LoadingController) {
    this.placeId = navParams.get("placeId");
    this.place = new Place();
    
  }

  ionViewDidLoad(){
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.geolocation.getCurrentPosition().then((resp) => {
       this.position.latitude = resp.coords.latitude;
       this.position.longitude = resp.coords.longitude;
       this.placeService.getDetails(this.placeId,this.position.latitude,this.position.longitude).subscribe(placeDetails=>{
         this.place = placeDetails;
         this.loader.dismiss();
       })
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
    start: this.position.latitude+","+ this.position.longitude
  };

  this.launchNavigator.navigate([this.place.position.latitude,this.place.position.longitude], options)
  .then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
    );
  }

  toGallery(){
      this.navCtrl.push(DetailsPage,{placeId:this.place._id,imageIds:this.place.imageIds})
  }

  sendEmail(){
    this.emailComposer.isAvailable().then((available: boolean) =>{
    if(available) {
       //Now we know we can send
        let email = {
        to: this.place.email,

        subject: this.place.name + ' booking',
        body: 'Hi '+this.place.name+',<br/>I wanted to book a table for ...',
        isHtml: true
      };
      this.emailComposer.open(email);
      }
    });
  }

  call(number:string){
   this.callNumber.callNumber(this.place.phoneNumber, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }
}
