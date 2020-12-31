import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';



import {ReactiveFormsModule} from '@angular/forms';

import { HomePage } from './home.page';
import { DataService } from '../data/data.service';
import { Network } from '@ionic-native/network/ngx';

import { FCM } from '@ionic-native/fcm/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage],
  providers:[
    DataService,
    FCM
  ]
})
export class HomePageModule {}
