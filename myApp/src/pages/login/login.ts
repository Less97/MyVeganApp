import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { LoginService } from '../../services/loginService';

export class User{
  constructor(
    public email: string,
    public password: string,
  ) {  }
}


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  user: User = {email:'',password:''}
  
  constructor(public navCtrl: NavController,loginService:LoginService) {
     
  }

  login(){
     loginService.login(this.user.email,this.user.password)
  }

  register(){
    this.navCtrl.setRoot(RegisterPage)
  }

}
