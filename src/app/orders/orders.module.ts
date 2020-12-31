import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import { HttpClientModule } from '@angular/common/http';


import {ReactiveFormsModule} from '@angular/forms';

import { NgxStarRatingModule } from 'ngx-star-rating';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule,
    HttpClientModule,
    NgxStarRatingModule,
   ReactiveFormsModule,FormsModule

  ],
  declarations: [OrdersPage]
})
export class OrdersPageModule {}
