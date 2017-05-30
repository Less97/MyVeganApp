import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Place } from '../../entities/place';
import { AddPlacePage } from '../../pages/addplace/addplace'
import { DetailsPage } from '../../pages/details/details';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  places:Place[] = [
    {_id:'1',name:'Restaurant 1',type:'restaurant',review:4.5},
    {_id:'2',name:'Restaurant 2',type:'restaurant',review:4.0},
    {_id:'3',name:'Restaurant 3',type:'restaurant',review:2.5},
    {_id:'4',name:'Cafe 1',type:'cafe',review:3.5},
    {_id:'5',name:'Cafe 2',type:'cafe',review:2.5},
    {_id:'6',name:'Shop 1',type:'restaurant',review:4.5},
    {_id:'1',name:'Shop 1',type:'restaurant',review:2.5}
  ]

  constructor(public navCtrl: NavController) {

  }

  goToAddPlace(){
    this.navCtrl.push(AddPlacePage)
  }

  goToDetails(){
    this.navCtrl.push(DetailsPage)
  }


}
