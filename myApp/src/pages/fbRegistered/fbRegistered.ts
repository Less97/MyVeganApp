import { Component } from '@angular/core';
import { NavController, NavParams, ToastController} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { UserService } from '../../services/userService';
//import { UserData } from '../../entities/userData';
import { ConfigsProvider } from '../../providers/configsProvider';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';



@Component({
  selector: 'page-fbRegistered',
  templateUrl: 'fbRegistered.html'
})

export class FBRegistered {

  user = {email:'',password:''}
  constructor(public navCtrl: NavController, public navParams: NavParams, public configsProvider:ConfigsProvider,
  private ga: GoogleAnalytics, private fb: Facebook,private toastCtrl: ToastController) {
    
  }

 ionViewDidLoad(){
    this.ga.startTrackerWithId('UA-82832670-5')
   .then(() => {
      this.ga.trackView('fbRegistered');
      this.ga.trackEvent('user','register','facebook');
   })
   .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

}
