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
  user = {firstName:'', lastName:'', email:'', password:'',confirmPassword:''}
  loader:Loading;
  constructor(public navCtrl: NavController,public userService: UserService,private loadingCtrl:LoadingController) {
    
  }

  register(){
     this.loader = this.loadingCtrl.create({
      content: "Creating User...",
    });
    this.loader.present();
    this.userService.register(this.user.firstName, this.user.lastName, this.user.email, this.user.password).subscribe(c=>{
      this.navCtrl.push(ConfirmEmailPage,{code:c.code,email:this.user.email})
      this.loader.dismiss();
    })
  }
}
