import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../services/userService';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {
  user = {firstName:'', lastName:'', email:'', password:'',confirmPassword:''}
  
  constructor(public navCtrl: NavController,public userService: UserService) {
    
  }

  register(user:any){
    console.dir(user);
    this.userService.register(this.user.firstName, this.user.lastName, this.user.email, this.user.password);
  }
}
