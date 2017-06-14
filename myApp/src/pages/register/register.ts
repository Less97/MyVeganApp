import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../services/userService';
import { ConfirmEmailPage } from '../confirmEmail/confirmEmail';
import { LoadingController,Loading } from 'ionic-angular';
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {
  user = {firstName:'sad', lastName:'sad', email:'sad@sda.it', password:'Password_123',confirmPassword:'Password_123'}
  loader:Loading;
  constructor(public navCtrl: NavController,public userService: UserService,private loadingCtrl:LoadingController) {
    
  }

  register(){
     this.loader = this.loadingCtrl.create({
      content: "Creating User...",
    });
    this.userService.register(this.user.firstName, this.user.lastName, this.user.email, this.user.password).subscribe(c=>{
      this.navCtrl.push(ConfirmEmailPage,{code:c.code})
      this.loader.dismiss();
    })
  }
}
