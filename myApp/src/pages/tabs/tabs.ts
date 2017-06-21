import { Component } from '@angular/core';

import { MapPage } from '../map/map';
import { ListPage } from '../list/list';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // tab1Root = HomePage;
  tab1Root = ListPage;
  tab2Root = MapPage;
 

  constructor() {

  } 
}
