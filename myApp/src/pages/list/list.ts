import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Place } from '../../entities/place';
import { DetailsPage } from '../../pages/details/details';
import { ImageHelper } from '../../helpers/imageHelper'
import { PlaceService } from '../../services/placeService'
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { EmailComposer } from '@ionic-native/email-composer';
import { LoadingController,Loading } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
   places:Place[]
   loader:Loading;
  constructor(public navCtrl: NavController,public placeService:PlaceService,private geolocation: Geolocation,
   private loadingCtrl:LoadingController,private ga: GoogleAnalytics,private emailComposer: EmailComposer) {
    
  }

  ionViewDidEnter(){
    this.loadPage();
  }
  
loadPage(){
  this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
  this.ga.startTrackerWithId('UA-82832670-5')
      .then(() => {
          this.ga.trackView('list');
      })
    .catch(e => console.log('Error starting GoogleAnalytics', e));
    this.loader.present();
    this.geolocation.getCurrentPosition().then((resp) => {
        this.placeService.getPlaces(resp.coords.latitude,resp.coords.longitude).subscribe(places=>{
            this.loader.dismiss();
            this.places = places;
        })
      }).catch((error) => {
        console.log('Error getting location', error);
      } );
}
  getImageSource(type:string):string{
    return ImageHelper.GetImageListSrc(type);
  }

  goToDetails(p:Place){
    this.navCtrl.push(DetailsPage,{placeId:p._id})
  }

  calculateDistance(d:number):string {
      return (d/1000).toFixed(1);
  }

  addPlace(){
      //Now we know we can send
      let email = {
        to: 'alessandro@thecuriouscarrot.com',
        subject: 'new place',
        body: 'Hi TheCuriousCarrot,<br/><br/> I saw that a place that I know is not enlisted in the app. Can you please add it? You can find the details below...<br/><br/>',
        isHtml: true
      };
      this.emailComposer.open(email);
  }
}
