import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { LoginService } from '../../services/loginService';
//import { UserData } from '../../entities/userData';
import { ConfigsProvider } from '../../providers/configsProvider';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  user = {email:'alessandro83lignano@gmail.com',password:'password'}
  
  constructor(public navCtrl: NavController,public loginService:LoginService,public configsProvider:ConfigsProvider) {
    
  }

  login(){
     this.loginService.login(this.user.email,this.user.password).subscribe(data=>
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
