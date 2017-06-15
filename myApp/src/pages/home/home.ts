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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

  searchSettings:SearchSettings;
  settingObserver:Observable<SearchSettings>;
  constructor(public navCtrl: NavController,public tagsService:TagsService,private ga: GoogleAnalytics,private configsProvider:ConfigsProvider) {
    this.searchSettings = this.configsProvider.getSearchSettings();

    tagsService.getTags().subscribe(tags=>{
      this.searchSettings.tags = tags;
    })
    this.settingObserver = Observable.of(this.searchSettings);
  }

  ionViewDidLoad(){
    this.ga.startTrackerWithId('UA-82832670-5')
   .then(() => {
     
        this.ga.trackView('home');
     // Tracker is ready
     // You can now track pages or set additional information such as AppVersion or UserId
   })
   .catch(e => console.log('Error starting GoogleAnalytics', e));

    this.settingObserver.subscribe(set=>{
      alert('changed')
    });
    alert('subscribed!');
    this.searchSettings.maxDistance =250;
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
