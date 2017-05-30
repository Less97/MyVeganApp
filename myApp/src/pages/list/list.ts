import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Place } from '../../entities/place';
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  places:Place[] = [
    {_id:'1', type:'restaurant', name:'Restaurant 1',review:4.6},
    {_id:'2', type:'restaurant', name:'Restaurant 2',review:4.1},
    {_id:'3', type:'restaurant', name:'Restaurant 2',review:3.6},
    {_id:'4', type:'cafe', name:'Restaurant 1',review:2.6},
    {_id:'5', type:'cafe', name:'Restaurant 2',review:4.6},
    {_id:'6', type:'cafe', name:'Restaurant 2',review:4.6},
    {_id:'7', type:'cafe', name:'Restaurant 1',review:2.6},
    {_id:'8', type:'shop', name:'Restaurant 2',review:4.6},
    {_id:'9', type:'shop', name:'Restaurant 2',review:4.6},
  ]

  constructor(public navCtrl: NavController) {

  }

  GoToAddPlace(){
    alert('go to add')
  }

}
