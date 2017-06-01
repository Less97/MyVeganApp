import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { LoginService } from '../../services/loginService';
import { UserData } from '../../entities/userData'



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  user = {email:'',password:''}
  myUserData:UserData; 
  constructor(public navCtrl: NavController,public loginService:LoginService) {
     
  }

  login(){
    this.loginService.login(this.user.email,this.user.password).subscribe(data=>
    {
      this.myUserData = data
    })

  }

  register(){
    this.navCtrl.setRoot(RegisterPage)
  }

}
