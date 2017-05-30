import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListPage } from '../list/list'
import { MapPage } from '../map/map'



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tags = [
      {_id:'Tag1',isSelected:false},{_id:'Tag2',isSelected:false},{_id:'Tag3',isSelected:false},
      {_id:'Tag4',isSelected:false},{_id:'Tag5',isSelected:false},{_id:'Tag6',isSelected:false},
      {_id:'Tag7',isSelected:false},{_id:'Tag8',isSelected:false},{_id:'Tag9',isSelected:false}
  ];



  maxDistance = 5 ;

  constructor(public navCtrl: NavController) {
  
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
