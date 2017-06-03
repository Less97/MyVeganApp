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


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConfigsProvider } from '../providers/configsProvider';
import { TagsService } from '../services/tagsService'
import { PlaceService } from '../services/placeService'

import { ImageHelper } from '../helpers/imageHelper'

import { LoginService } from '../services/loginService';

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    ListPage,
    HomePage,
    TabsPage,
    LoginPage,
    DetailsPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
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
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ConfigsProvider,
    LoginService,
    TagsService,
    PlaceService,
    Geolocation,
    ImageHelper,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
