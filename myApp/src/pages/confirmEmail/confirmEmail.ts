import { Component } from '@angular/core';
import { NavController ,NavParams } from 'ionic-angular';
import { UserService } from '../../services/userService';
//import { UserData } from '../../entities/userData';
import { ConfigsProvider } from '../../providers/configsProvider';
import { HomePage } from '../home/home';
import { LoadingController,Loading } from 'ionic-angular';


@Component({
  selector: 'page-confirmEmail',
  templateUrl: 'confirmEmail.html'
})

export class ConfirmEmailPage {

  confirmation = {code:''}
  receivedCode:string = '';
  isProcessCompleted:boolean = false;
  isCodeFailed:boolean = false;
  email:string = '';
   loader:Loading;
  constructor(public navCtrl: NavController, public configsProvider:ConfigsProvider,public navParams: NavParams,private userService:UserService,private loadingCtrl:LoadingController) {
    this.receivedCode = navParams.get("code");
    this.email = navParams.get("email");
    this.isProcessCompleted = false;
  }

  submitCode(){
    this.loader = this.loadingCtrl.create({
      content: "Creating user...",
    });
    this.loader.present();
    if(this.receivedCode == this.confirmation.code){
      this.userService.confirmCode(this.email).subscribe(obj=>{
        if(!obj.error){
          this.isProcessCompleted = true;
          this.isCodeFailed = false;
          this.loader.dismiss();
        }
      })
    }else{
      this.isCodeFailed = true;
    }
  }

  goToApp(){
    this.navCtrl.setRoot(HomePage)
  }


}


