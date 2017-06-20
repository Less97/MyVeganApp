import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { UserService } from '../../services/userService';
//import { UserData } from '../../entities/userData';
import { ConfigsProvider } from '../../providers/configsProvider';
import { GoogleAnalytics } from '@ionic-native/google-analytics';



@Component({
  selector: 'page-changePassword',
  templateUrl: 'changePassword.html'
})

export class ChangePasswordPage {

  formPassword = {password:'',confirmPassword:''}
  
  constructor(public navCtrl: NavController, public userService:UserService, public configsProvider:ConfigsProvider) {
    
  }

   



}
