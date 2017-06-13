import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Place } from '../../entities/place';
import { AddPlacePage } from '../../pages/addplace/addplace'
import { DetailsPage } from '../../pages/details/details';
import { ImageHelper } from '../../helpers/imageHelper'
import { PlaceService } from '../../services/placeService'
import { Geolocation } from '@ionic-native/geolocation';

import { LoadingController,Loading } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
   places:Place[]
   loader:Loading;
  constructor(public navCtrl: NavController,public placeService:PlaceService,private geolocation: Geolocation,private loadingCtrl:LoadingController) {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
  }

  ionViewDidLoad(){
   this.loader.present();
   this.geolocation.getCurrentPosition().then((resp) => {
      this.placeService.getPlaces(resp.coords.latitude,resp.coords.longitude).subscribe(places=>{
          this.places = places;
          this.loader.dismiss();
      })
    }).catch((error) => {
      console.log('Error getting location', error);
    } );

      
  }

  getImageSource(type:string):string{
    return ImageHelper.GetImageListSrc(type);
  }

  goToAddPlace(){
    this.navCtrl.push(AddPlacePage)
  }

  goToDetails(p:Place){
    this.navCtrl.push(DetailsPage,{placeId:p._id})
  }

  calculateDistance(d:number):string {
      return (d/1000).toFixed(1);
  }

}
