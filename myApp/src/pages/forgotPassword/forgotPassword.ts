import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../services/userService'
import { LoadingController,Loading,ToastController } from 'ionic-angular';
import { ChangePasswordPage } from '../changePassword/changePassword'



@Component({
  selector: 'page-forgotPassword',
  templateUrl: 'forgotPassword.html'
})

export class ForgotPasswordPage {

  forgotPassword = {email:''};
  code = {code:'',GeneratedCode:''};
  loader:Loading;
  isCodePhase:boolean = false;


  constructor(public navCtrl: NavController, private userService:UserService,private loadingCtrl:LoadingController,private toastCtrl: ToastController) {
     this.loader = this.loadingCtrl.create({
      content: "Checking User Email...",
    });
  }

  restorePassword(){
    this.loader.present();
    this.userService.restorePassword(this.forgotPassword.email).subscribe(res=>{
      this.loader.dismiss();
      if(res.error==true){
        let toast = this.toastCtrl.create({
            message: 'Sorry, there was a problem confirming your email',
            duration: 3000,
            position: 'center'
          });
          toast.present()
      }else{
        this.code.GeneratedCode = res.code;
        let toast = this.toastCtrl.create({
            message: 'Thanks, we sent you the email confirmation code. Check your email',
            duration: 3000,
            position: 'center'
          });
          toast.present();
           toast.onDidDismiss(() => {
              this.isCodePhase = true;
           })
      }
    })
    
  }
 
  submitCode(){
     this.loader = this.loadingCtrl.create({
      content: "Confirm Code...",
    });
    this.loader.present();
    this.userService.changePassword(this.forgotPassword.email,this.code.code).subscribe(res=>{
      if(res.error){
        let toast = this.toastCtrl.create({
            message: 'Sorry, the code you inserted is not valid',
            duration: 3000,
            position: 'center'
          });
          toast.present();
      }else{
            let toast = this.toastCtrl.create({
            message: 'Thanks, Please select a new password ',
            duration: 3000,
            position: 'center'
          });
          toast.present();
          toast.onDidDismiss(()=>{
            this.navCtrl.setRoot(ChangePasswordPage)
          })
      }
    });
  }
  
}
