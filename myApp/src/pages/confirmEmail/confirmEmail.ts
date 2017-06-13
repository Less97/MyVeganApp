import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../services/userService';
//import { UserData } from '../../entities/userData';
import { ConfigsProvider } from '../../providers/configsProvider';



@Component({
  selector: 'page-confirmEmail',
  templateUrl: 'confirmEmail.html'
})

export class ConfirmEmail {

  confirmation = {code:''}
  
  constructor(public navCtrl: NavController, public userService:UserService, public configsProvider:ConfigsProvider) {
    
  }

  checkCode(){

  }

}


