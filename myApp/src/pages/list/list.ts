import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { PlaceBase } from '../../entities/placeBase';
import { AddPlacePage } from '../../pages/addplace/addplace'
import { DetailsPage } from '../../pages/details/details';
import { ImageHelper } from '../../helpers/imageHelper'
import { PlaceService } from '../../services/placeService'

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
   //places:PlaceBase[]

  constructor(public navCtrl: NavController,public placeService:PlaceService) {
    // placeService.getPlacesBases(53.3421156,-9.2592088).subscribe(places=>{
    //   this.places = places;
    // })
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
