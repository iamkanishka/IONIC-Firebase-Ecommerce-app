import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';
import {ReactiveFormsModule} from '@angular/forms';

import { LoginPage } from './login.page';
import { IonicStorageModule } from '@ionic/storage';
import { DataService } from '../data/data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
driverOrder: ['indexeddb', 'sqlite', 'websql']
    })

  ],
  declarations: [LoginPage],
  providers: [
   
DataService
  ],
})
export class LoginPageModule {}
