import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaceordPage } from './placeord.page';

const routes: Routes = [
  {
    path: '',
    component: PlaceordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaceordPageRoutingModule {}
