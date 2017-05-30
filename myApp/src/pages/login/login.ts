import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { NgForm } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';

class User{
  email: string;
  password: string;
}


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  user:User = {
    email:'',
    password:''
  }

  constructor(public navCtrl: NavController) {

  }

  login(){
     this.navCtrl.setRoot(TabsPage)
  }

  register(){
    this.navCtrl.setRoot(RegisterPage)
  }

}
