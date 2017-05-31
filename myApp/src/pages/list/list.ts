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
    {_id:'1',name:'Restaurant 1',type:'restaurant',review:4.5,position:{latitude:0,longitude:0}},
    {_id:'2',name:'Restaurant 2',type:'restaurant',review:4.0,position:{latitude:0,longitude:0}},
    {_id:'3',name:'Restaurant 3',type:'restaurant',review:2.5,position:{latitude:0,longitude:0}},
    {_id:'4',name:'Cafe 1',type:'cafe',review:3.5,position:{latitude:0,longitude:0}},
    {_id:'5',name:'Cafe 2',type:'cafe',review:2.5,position:{latitude:0,longitude:0}},
    {_id:'6',name:'Shop 1',type:'shop',review:4.5,position:{latitude:0,longitude:0}},
    {_id:'7',name:'Shop 1',type:'shop',review:2.5,position:{latitude:0,longitude:0}},
    {_id:'8',name:'Shop 3',type:'shop',review:2.5,position:{latitude:0,longitude:0}},
    {_id:'9',name:'Cafe 3',type:'cafe',review:3.0,position:{latitude:0,longitude:0}},
    {_id:'10',name:'Cafe 3',type:'cafe',review:3.0,position:{latitude:0,longitude:0}}
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
