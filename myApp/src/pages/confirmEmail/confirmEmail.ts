import { Component } from '@angular/core';
import { NavController ,NavParams, ToastController } from 'ionic-angular';
import { UserService } from '../../services/userService';
//import { UserData } from '../../entities/userData';
import { ConfigsProvider } from '../../providers/configsProvider';
import { TabsPage } from '../tabs/tabs';
import { LoadingController,Loading } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';


@Component({
  selector: 'page-confirmEmail',
  templateUrl: 'confirmEmail.html'
})

export class ConfirmEmailPage {

  confirmation = {code:''}
  receivedCode:string = '';
  isProcessCompleted:boolean = false;
  isCodeFailed:boolean = false;
  email:string = '';
  loader:Loading;

  constructor(public navCtrl: NavController, public configsProvider:ConfigsProvider,
  public navParams: NavParams,private userService:UserService,private loadingCtrl:LoadingController,private ga: GoogleAnalytics,
    private toastCtrl: ToastController) {
    this.receivedCode = navParams.get("code");
    this.email = navParams.get("email");
    this.isProcessCompleted = false;
  }

  ionViewDidLoad(){
    
  }

  submitCode(){
    this.loader = this.loadingCtrl.create({
      content: "Creating user...",
    });
    this.loader.present();
    if(this.receivedCode == this.confirmation.code){
      this.userService.confirmCode(this.email).subscribe(obj=>{
        if(!obj.error){
         this.registrationCompleted();
        }
      })
    }else{
      this.isCodeFailed = true;
    }
  }

  registrationCompleted():void{
     this.isProcessCompleted = true;
          this.isCodeFailed = false;
          this.loader.dismiss();
           this.ga.startTrackerWithId('UA-82832670-5')
           .then(() => {
              this.ga.trackEvent('User','Register',this.email);
              // Tracker is ready
              // You can now track pages or set additional information such as AppVersion or UserId
          }).catch(e => console.log('Error starting GoogleAnalytics', e));
    
      let toast = this.toastCtrl.create({
            message: 'Thanks a lot. Let\'s try to find you interesting places...',
            duration: 3000,
            position: 'center'
          });

      toast.onDidDismiss(() => {
        this.navCtrl.setRoot(TabsPage);
      });

      toast.present();

  }

}


