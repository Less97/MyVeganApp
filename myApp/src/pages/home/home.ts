import { Component,ChangeDetectionStrategy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListPage } from '../list/list'
import { MapPage } from '../map/map'
import { Tag } from '../../entities/tag'
import { TagsService } from '../../services/tagsService'
import { SearchSettings } from '../../entities/searchSettings'
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Observable } from 'rxjs/Rx';
import { ConfigsProvider } from '../../providers/configsProvider'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  searchSettings:SearchSettings;  
  constructor(public navCtrl: NavController,public tagsService:TagsService,private ga: GoogleAnalytics,private configsProvider:ConfigsProvider) {
  this.searchSettings = new SearchSettings(30,[]);
  let selected = configsProvider.getSearchSettings().tags.filter(x=>x.selected ==true);
  this.searchSettings.maxDistance = configsProvider.getSearchSettings().maxDistance;
  this.tagsService.getTags().subscribe(ts=>{
        this.searchSettings.tags = ts;
        this.searchSettings.tags.forEach(t=>{
          if(selected.filter(x=>x._id==t._id).length>0)
            t.selected =true;
        });
      })
  
  }

  notifyChange(){
    this.configsProvider.saveSearchSettings(this.searchSettings);
  }
  

  ionViewDidLoad(){
      
    this.ga.startTrackerWithId('UA-82832670-5')
   .then(() => {
     
        this.ga.trackView('home');
     // Tracker is ready
     // You can now track pages or set additional information such as AppVersion or UserId
   })
   .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  goNearby(){
    //Set Current Selection

    this.navCtrl.setRoot(MapPage)
  }

  findAll(){
    //Set current Selection

    this.navCtrl.setRoot(ListPage)
  }

}
