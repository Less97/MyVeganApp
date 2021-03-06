import { Component, ViewChild, ElementRef  } from '@angular/core';
import { NavController ,NavParams,ModalController, ViewController } from 'ionic-angular';
import { Place } from '../../entities/place';
import { CallNumber } from '@ionic-native/call-number';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { ImageHelper } from '../../helpers/imageHelper'
import { Geolocation } from '@ionic-native/geolocation';
import { EmailComposer } from '@ionic-native/email-composer';
import { PlaceService } from '../../services/placeService'
import { LoadingController,Loading,Platform  } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GalleryPage } from '../gallery/gallery'


declare var google;


@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})

export class DetailsPage {
  placeId:string;
  place:Place;
  loader:Loading;
  position:{latitude:number,longitude:number} = {latitude:0,longitude:0};
  isContentReady:boolean;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  placeMarker:any;
  canShare:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private imageHelper:ImageHelper,private geolocation: Geolocation, 
    private callNumber: CallNumber,private launchNavigator: LaunchNavigator,private emailComposer: EmailComposer,
    private placeService:PlaceService,private loadingCtrl:LoadingController,private ga: GoogleAnalytics/*,private platform:Platform*/,
    private socialSharing: SocialSharing,private iab: InAppBrowser,public modalCtrl: ModalController) {

    this.placeId = navParams.get("placeId");
    this.place = new Place();
    
    this.loader = this.loadingCtrl.create({
      content: "Loading details...",
    });
    this.isContentReady = false;
    // this.socialSharing.canShareViaEmail().then(() => {
    //   // Sharing via email is possible
    //   this.canShare = true;
    // }).catch(() => {
    //   // Sharing via email is not possible
    //   this.canShare = false;
    // });
  }

  ionViewDidLoad(){
   this.loader.present();
     this.ga.startTrackerWithId('UA-82832670-5')
    .then(() => {
        this.ga.trackView('details');
      //  this.ga.setAppVersion(this.platform.platforms().join(' '))
     })
   .catch(e => console.log('Error starting GoogleAnalytics', e));

    this.geolocation.getCurrentPosition().then((resp) => {
       this.position.latitude = resp.coords.latitude;
       this.position.longitude = resp.coords.longitude;
       this.placeService.getDetails(this.placeId,this.position.latitude,this.position.longitude).subscribe(placeDetails=>{
       this.loader.dismiss();
       this.place = placeDetails;
       this.isContentReady = true;
       this.loadMap();
       
       })
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    
  
  }

  

  loadMap(){
     let latLng = new google.maps.LatLng(this.place.position.latitude, this.place.position.longitude);
     let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      gestureHandling: 'cooperative'
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.placeMarker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
      });
    google.maps.event.addListener(this.placeMarker, "click", function() {
    //create a new InfoWindow instance
    new google.maps.InfoWindow({  
      content: this.place.name  
    }); 
    });
    google.maps.event.trigger(this.map, 'resize');
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

  openImg(img:String){
     let imgModal = this.modalCtrl.create(GalleryPage);
     imgModal.present();
  }

  goToWebsite(){
    this.iab.create(this.place.website);
  }

  sendEmail(){
      //Now we know we can send
      let email = {
      to: this.place.email,

      subject: this.place.name + ' booking',
      body: 'Hi '+this.place.name+',<br/>I wanted to book a table for ...',
      isHtml: true
      };

      this.emailComposer.open(email);
  }

  getImgUrl(imgId:string){
    return this.placeService.getImgSource(imgId);
  }

  call(number:string){
   this.callNumber.callNumber(this.place.phoneNumber, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
  }

  share(){
    this.socialSharing.share('I\'ve just discovered '+this.place.name+' through theCuriousCarrot. ','I\'ve just discovered a new vegan place, '+this.place.name,null,null)
  }
}
