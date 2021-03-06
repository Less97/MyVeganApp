import { Component } from '@angular/core';
import { NavController, ToastController, NavParams} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { UserService } from '../../services/userService';
import { ConfigsProvider } from '../../providers/configsProvider';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { FBRegistered } from '../fbRegistered/fbRegistered'



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  private destination:string;

  user = {email:'',password:''}

  constructor(public navCtrl: NavController, public navParams: NavParams, public userService:UserService, public configsProvider:ConfigsProvider,
  private ga: GoogleAnalytics, private fb: Facebook,private toastCtrl: ToastController) {
    this.destination = this.navParams.get('destination');
  }

 ionViewDidLoad(){
    this.ga.startTrackerWithId('UA-82832670-5')
   .then(() => {
      this.ga.trackView('home');
   })
   .catch(e => console.log('Error starting GoogleAnalytics', e));
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
    this.navCtrl.push(RegisterPage)
  }

  facebookLogin(){
    this.fb.login(['email','public_profile','user_friends'])
    .then((res: FacebookLoginResponse)=>{
     if(res.status == "connected"){
        var accessToken = res.authResponse.accessToken;
        this.fb.api("/me?fields=id,first_name,last_name,email", ["public_profile", "email","user_friends"]).then(res=>{
         this.userService.loginViaFacebook(res.first_name,res.last_name,res.email,res.id).subscribe(serverRes=>{
            if(res.json().status=='loggedIn'){
              this.navCtrl.setRoot(TabsPage);
            }else{
              this.navCtrl.setRoot(FBRegistered,{
                email:res.email
              });
            }
         });
         
        }).catch(()=>{
           let toast = this.toastCtrl.create({
             message: 'Sorry, there was an error creating the user.Please try again or contact us.',
            duration: 3000,
            position: 'center'
      })
      toast.present();
        })
      this.navCtrl.setRoot(TabsPage)
     }else{
      let toast = this.toastCtrl.create({
             message: 'Sorry, there was an error contacting facebook. If happens again, please contact us.',
            duration: 3000,
            position: 'center'
      })
      toast.present();
     }
    }).catch(()=>{

    })
  }


}
