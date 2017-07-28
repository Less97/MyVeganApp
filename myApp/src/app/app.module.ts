import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { MapPage } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { DetailsPage } from '../pages/details/details';
import { RegisterPage } from '../pages/register/register';
import { ConfirmEmailPage } from '../pages/confirmEmail/confirmEmail';
import { ForgotPasswordPage } from '../pages/forgotPassword/forgotPassword';
import { GalleryPage } from '../pages/gallery/gallery';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConfigsProvider } from '../providers/configsProvider';
import { TagsService } from '../services/tagsService'
import { PlaceService } from '../services/placeService'

import { ImageHelper } from '../helpers/imageHelper'

import { UserService } from '../services/userService';

import { Ionic2RatingModule } from 'ionic2-rating';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Facebook } from '@ionic-native/facebook'
import { AppRate } from '@ionic-native/app-rate';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Platform } from 'ionic-angular'

//directives:
import { EqualValidator } from '../directives/validators/validateEqual';

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    ListPage,
    HomePage,
    TabsPage,
    LoginPage,
    DetailsPage,
    RegisterPage,
    ConfirmEmailPage,
    ForgotPasswordPage,
    EqualValidator,
    GalleryPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule // Put ionic2-rating module here
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    ListPage,
    HomePage,
    TabsPage,
    LoginPage,
    DetailsPage,
    RegisterPage,
    ConfirmEmailPage,
    ForgotPasswordPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ConfigsProvider,
    UserService,
    TagsService,
    PlaceService,
    Geolocation,
    ImageHelper,
    CallNumber,
    EmailComposer,
    LaunchNavigator,
    GoogleAnalytics,
    Facebook,
    AppRate,
    Platform,
    InAppBrowser, 
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
