import { Component, OnInit } from '@angular/core';
import { Platform,NavController } from '@ionic/angular';
import { Router, Navigation } from '@angular/router';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

import * as firebase from "firebase/app";
import { Storage } from '@ionic/storage';


import { LoadingController } from '@ionic/angular';

import { Observable } from "rxjs";
import { map, shareReplay, tap, startWith, } from "rxjs/operators";
import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';



export interface orders {
  fullname?: string;
  
  phone?: number;
 variety?:string;
dfls?:number
  odate?: any;
  ddate?: any;

tdate?:any;

}

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
 

  orddata:any 
  showconto:boolean = false;

  showuq:boolean=false;
  private orderscollection: AngularFirestoreCollection<orders>;
  orders: Observable<orders[]>;
  
  constructor(
    private platform: Platform,private router: Router, private afs: AngularFirestore, private storage: Storage,
    private fcm:FCM, private lno:LocalNotifications 
  ) {
    
    

    this.fcm.onNotification().subscribe(data => {
 
      if(data.wasTapped){
        console.log("Received in background");
      
        this.storage.get("noti").then((nnres) => {
        
      
       var noti={
        notinum: nnres.notinum+1
      }
    
      this.storage.set("noti", noti)
      
        
        })
    
       
        
    
    
      } else {
        var kkk  = JSON.stringify(data)
    
    
        this.storage.get("noti").then((nnres) => {
         
      
       var noti={
        notinum: nnres.notinum+1
      }
    
      this.storage.set("noti", noti)
    
        
        })
    
       
    
        console.log("Received in foreground");
    
        this.lno.schedule([{
          text: data.subtitle,
        title:data.title,
    
        }]);
    
      };
    });
    









    this.platform.backButton.subscribe((res)=>{
      this.router.navigate(['/home']);
    
      })


      this.storage.get("userdetails").then((res) => {
        setTimeout(() => {

      this.orderscollection = afs.collection<orders>("userqueries", ref => ref.where('adharno', '==', Number(res.adharno)).orderBy('created', 'desc'));
      this.orders = this.orderscollection.snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
         
            const data =  a.payload.doc.data() as orders

           
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );

      this.orders.subscribe((res) => {
        this.showuq=true;
        console.log(res)

        this.orddata = res
        this.showconto = true;
      })
    })
  })


  }

  ngOnInit() {
  }
 
}
