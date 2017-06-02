import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListPage } from '../list/list'
import { MapPage } from '../map/map'
import { Tag } from '../../entities/tag'
import { TagsService } from '../../services/tagsService'



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tags:Tag[];
  maxDistance = 5 ;

  constructor(public navCtrl: NavController,public tagsService:TagsService) {
    tagsService.getTags().subscribe(tags=>{
      this.tags = tags;
    })
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
