import { Component } from '@angular/core';
import { NavController ,NavParams } from 'ionic-angular';
import { UserService } from '../../services/userService';
//import { UserData } from '../../entities/userData';
import { ConfigsProvider } from '../../providers/configsProvider';
import { HomePage } from '../home/home'


@Component({
  selector: 'page-confirmEmail',
  templateUrl: 'confirmEmail.html'
})

export class ConfirmEmailPage {

  confirmation = {code:''}
  receivedCode:string = '';
  isProcessCompleted:boolean = false;
  isCodeFailed:boolean = false;

  constructor(public navCtrl: NavController, public configsProvider:ConfigsProvider,public navParams: NavParams) {
    this.receivedCode = navParams.get("code");
  }

  submitCode(){
    if(this.receivedCode == this.confirmation.code){
      this.isProcessCompleted = true;
      this.isCodeFailed = false;
    }else{
      this.isCodeFailed = true;
    }
  }

  goToApp(){
    this.navCtrl.setRoot(HomePage)
  }


}


