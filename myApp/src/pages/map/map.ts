import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PlaceService } from '../../services/placeService';
import { Place } from '../../entities/place'
import { ImageHelper } from '../../helpers/imageHelper'
import { LoadingController,Loading } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  places:Place[];
  infoWindow:any;
  uMarker:any;
  loader:Loading;
  constructor(public navCtrl: NavController,private geolocation: Geolocation,private placeService:PlaceService,
  private imageHelper:ImageHelper,public loadingCtrl: LoadingController
  ) {
    
  }

  ionViewDidLoad(){
     this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    
    this.loader.present();

    this.geolocation.getCurrentPosition().then((resp) => {

      this.placeService.getPlaces(resp.coords.latitude,resp.coords.longitude).subscribe(places=>{
        this.places = places;
        this.loadMap(resp.coords.latitude,resp.coords.longitude);
      })

    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }
 
  test:number = 2;

  loadMap(lat:number,lng:number){
 
    let latLng = new google.maps.LatLng(lat, lng);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.uMarker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: 'assets/placeTypes/pins/home.png'
      });
    
      google.maps.event.addListener(this.uMarker, "click", function() {
	      //create a new InfoWindow instance
        var infowindow = new google.maps.InfoWindow({  
          content: 'You.'  
        }); 
 
        infowindow.open(this.map, this.uMarker);
      });

      this.places.forEach(p=>{
         var m= new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(p.position.latitude, p.position.longitude),
          icon: ImageHelper.GetImageMapSrc(p.type)
        });
        google.maps.event.addListener(m, "click", function() {
	      //create a new InfoWindow instance
        var infowindow = new google.maps.InfoWindow({  
          content: '<h3>'+p.name+'</h3><p>'+p.description+'</p><button style="float:right" (click)="goToDetails()" class="button button-md button-default button-default-md">Details ></button> '  
        }); 
 
        infowindow.open(this.map, m);
      });

      })
      this.loader.dismiss()

  }

}
