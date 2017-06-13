import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { UserService } from '../../services/userService';
//import { UserData } from '../../entities/userData';
import { ConfigsProvider } from '../../providers/configsProvider';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  user = {email:'',password:''}
  
  constructor(public navCtrl: NavController, public userService:UserService, public configsProvider:ConfigsProvider) {
    
  }

  login(){
    this.userService.login(this.user.email,this.user.password).subscribe(data=>
    {
      if(data.isLoggedIn){
        this.configsProvider.saveUserData(data);
        this.navCtrl.setRoot(TabsPage);
      }
    })
  }

  register(){
    this.navCtrl.setRoot(RegisterPage)
  }

}
