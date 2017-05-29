import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

export class Tag{
  _id: string;
  isSelected: boolean
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tags: Tag[];
   maxDistance = 5;

  constructor(public navCtrl: NavController) {
    this.tags =  [{_id:'#Tag1',isSelected:false},{_id:'#Tag2',isSelected:false},{_id:'#Tag3',isSelected:false}];
  }

}
