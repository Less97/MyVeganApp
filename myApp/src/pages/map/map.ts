import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PlaceService } from '../../services/placeService';
import { Place } from '../../entities/place'

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
  constructor(public navCtrl: NavController,private geolocation: Geolocation,private placeService:PlaceService) {
    
  }

  ionViewDidLoad(){
    
    this.geolocation.getCurrentPosition().then((resp) => {

      this.placeService.getPlaces(resp.coords.latitude,resp.coords.longitude).subscribe(places=>{
        this.places = places;
        this.loadMap(resp.coords.latitude,resp.coords.longitude);
      })

    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }
 
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
    
      this.places.forEach(p=>{
        new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(p.position.latitude, p.position.longitude),
        icon: 'assets/placeTypes/pins/home.png'
      });
      })
      

  }

}
