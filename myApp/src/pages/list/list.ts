import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Place } from '../../entities/place';
import { AddPlacePage } from '../../pages/addplace/addplace'
import { DetailsPage } from '../../pages/details/details';
import { ImageHelper } from '../../helpers/imageHelper'
import { PlaceService } from '../../services/placeService'
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
   places:Place[]

  constructor(public navCtrl: NavController,public placeService:PlaceService,private geolocation: Geolocation) {
   
  }

  ionViewDidLoad(){

   this.geolocation.getCurrentPosition().then((resp) => {

      this.placeService.getPlaces(resp.coords.latitude,resp.coords.longitude).subscribe(places=>{
          this.places = places;
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

  goToDetails(){
    this.navCtrl.push(DetailsPage)
  }


}
