import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { ConfigsProvider } from '../providers/configsProvider' 

import { TabsPage } from '../pages/tabs/tabs';
import { DetailsPage } from '../pages/details/details'
import { ForgotPasswordPage } from '../pages/forgotPassword/forgotPassword';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,configsProvider: ConfigsProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.rootPage = ForgotPasswordPage
    });
  }
}
