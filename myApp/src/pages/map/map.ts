import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PlaceService } from '../../services/placeService';
import { Place } from '../../entities/place'
import { ImageHelper } from '../../helpers/imageHelper'
import { LoadingController,Loading } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { DetailsPage } from '../details/details'

declare var google;
declare var MarkerClusterer:any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  self = this;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  places:Place[];
  markers:Object[];
  infoWindow:any;
  uMarker:any;
  loader:Loading;
  bounds:any;
  
  

  constructor(public navCtrl: NavController,private geolocation: Geolocation,private placeService:PlaceService,
  private imageHelper:ImageHelper,public loadingCtrl: LoadingController,private ga: GoogleAnalytics
  ) {
    this.markers = [];
  }

 
ionViewDidEnter(){
this.ga.startTrackerWithId('UA-82832670-5')
    .then(() => {
     this.ga.trackView('map');
      // Tracker is ready
      // You can now track pages or set additional information such as AppVersion or UserId
    }).catch(e => console.log('Error starting GoogleAnalytics', e));


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

  loadMap(lat:number,lng:number){
 
    let latLng = new google.maps.LatLng(lat, lng);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    
     var clusterStyles = [{
            textColor: '#FFFFFF',
            url: 'assets/placeTypes/pins/cluster/m.png',
            height: 100,
            width: 100,
            textSize: 20
          }, ]
      var clusterOpt = {
        styles: clusterStyles
      }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.bounds =  new google.maps.LatLngBounds();
    this.uMarker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: 'assets/placeTypes/pins/home.png'
      });
    var self = this;
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
        this.markers.push(m)
        
        this.bounds.extend(m.position)
        this.map.fitBounds(this.bounds);
        google.maps.event.addListener(m, "click", function() {
	      //create a new InfoWindow instance
        var infowindow = new google.maps.InfoWindow({  
          content: '<div>'
          +'<h3>'+p.name+'</h3>'
          +'<p>'+p.description+'</p>'
          +'<button id="goToDetails" pId="'+p._id+'" class="button button-md button-default button-default-md float-right">></button>'+
          '</div>' 
        }); 

        //Creates the event listener for clicking the marker and places the marker on the map 
        google.maps.event.addListener(m, 'click', ((marker, markerCount) => {       
          return () => {        
            infowindow.open(this.map, m); 
          } 
        })(m, this.markerCount)); 

        google.maps.event.addListener(infowindow, 'domready', () => {
      document.getElementById('goToDetails').addEventListener('click', () => {
        self.navCtrl.push(DetailsPage,{place:p});
      }, false);
    }); 
    

      });
    });
     var cluster = new MarkerClusterer(this.map, this.markers, clusterOpt);
     cluster = cluster;
     this.loader.dismiss()

  }

}
