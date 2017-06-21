import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../services/userService'
import { LoadingController,Loading,ToastController } from 'ionic-angular';
import { ListPage } from '../list/list'


enum ForgotPasswordPageState{
  InsertEmail,
  ConfirmEmail,
  ChangePassword
}

@Component({
  selector: 'page-forgotPassword',
  templateUrl: 'forgotPassword.html'
})


export class ForgotPasswordPage {

  forgotPasswordModel = {email:''};
  codeModel = {code:'',GeneratedCode:''};
  passwordModel = {password:'',confirmPassword:''}

  loader:Loading;
  currentState:ForgotPasswordPageState = ForgotPasswordPageState.InsertEmail;
  

  constructor(public navCtrl: NavController, private userService:UserService,private loadingCtrl:LoadingController,private toastCtrl: ToastController) {
     this.loader = this.loadingCtrl.create({
      content: "Checking User Email...",
    });
  }

  getCurrentState():string{
    if(this.currentState == ForgotPasswordPageState.InsertEmail) return "InsertEmail"
    if(this.currentState == ForgotPasswordPageState.ConfirmEmail) return "ConfirmEmail"
    if(this.currentState == ForgotPasswordPageState.ChangePassword) return "ChangePassword"
    return "";
  }

  public insertEmail(){
    this.loader.present();
    this.userService.restorePassword(this.forgotPasswordModel.email).subscribe(res=>{
      this.loader.dismiss();
      if(res.error==true){
        let toast = this.toastCtrl.create({
            message: 'Sorry, there was a problem confirming your email',
            duration: 3000,
            position: 'center'
          });
          toast.present()
      }else{
        this.codeModel.GeneratedCode = res.code;
        let toast = this.toastCtrl.create({
            message: 'Thanks, we sent you the email confirmation code. Check your email',
            duration: 3000,
            position: 'center'
          });
          toast.present();
           toast.onDidDismiss(() => {
            this.currentState = ForgotPasswordPageState.ConfirmEmail;
           })
      }
    })
    
  }
 
  submitCode(){
     if(this.codeModel.code==this.codeModel.GeneratedCode){
        let toast = this.toastCtrl.create({
            message: 'Thanks, the code is valid, please insert your password',
            duration: 3000,
            position: 'center'
          });
          toast.present()
          toast.onDidDismiss(()=>{
              this.currentState = ForgotPasswordPageState.ChangePassword;
          });
     }else{
       let toast = this.toastCtrl.create({
            message: 'Sorry, the code you selected is not valid, Please check your email and try again',
            duration: 3000,
            position: 'center'
          });

        toast.present();
        
     }
  }

  changePassword(){
    this.loader = this.loadingCtrl.create({
      content: "Changing your password",
    });
    this.loader.present();
    if(this.passwordModel.password==this.passwordModel.confirmPassword){
        this.userService.changePassword(this.forgotPasswordModel.email,this.passwordModel.password).subscribe(()=>{
            this.loader.dismiss();
            let toast = this.toastCtrl.create({
            message: 'Thanks, your password has changed.',
            duration: 3000,
            position: 'center'
          });
          toast.present();
          toast.onDidDismiss(()=>{
            this.navCtrl.setRoot(ListPage)
          })
        })
    }else{
       let toast = this.toastCtrl.create({
            message: 'Sorry, the two password you inserted don\'t match. Please check the fields and try again',
            duration: 3000,
            position: 'center'
          });

        toast.present();
    }
  }
  
}
