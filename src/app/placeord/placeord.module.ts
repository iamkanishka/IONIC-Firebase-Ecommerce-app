import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceordPageRoutingModule } from './placeord-routing.module';

import { PlaceordPage } from './placeord.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceordPageRoutingModule
  ],
  declarations: [PlaceordPage]
})
export class PlaceordPageModule {}
