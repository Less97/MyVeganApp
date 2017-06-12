import { Component } from '@angular/core';
import { NavController ,NavParams } from 'ionic-angular';
import { ConfigsProvider } from '../../providers/configsProvider'


@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html'
})

export class GalleryPage {
  isGalleryEmpty:boolean;
  placeId:string;
  images:string[];
  serviceUrl:string; 

  constructor(public navCtrl: NavController,public navParams: NavParams, public configsProvider:ConfigsProvider) {
    this.placeId = navParams.get("placeId") as string;
    this.images = navParams.get("imageIds") as string[];
    this.serviceUrl = configsProvider.getServiceUrl();
  }

  ionViewDidLoad(){

  }

  getFullUrl(id:string){
    return this.serviceUrl + 'images/get?imgId='+id;
  }

}
