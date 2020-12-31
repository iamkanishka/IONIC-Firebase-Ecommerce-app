import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";

import { Observable,of } from "rxjs";
import { map, shareReplay, tap, startWith, timeout, } from "rxjs/operators";
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

export interface customers {
  id?:string
  fullname?: string;
  adharno?: number;
  phone?: number;
  address?: string;
  state?: string;
  district?: string;
  town?: string;
  date?: any;
  culttype?: string;
  land?: number;
  odate?: any;
  village?: string;
licno?:string;
sdetails?:[];
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  len:number;
datalength:number;
 data:any[]=[];
batch:string[]=[]
select:string

isdataready:boolean=false;

private detailcollection: AngularFirestoreCollection<customers>;
 details: Observable<customers[]>;
 

 catmenu:string;

readystatus:Observable<boolean>=of(false)
public device_token: String="";


 
   constructor( private afs: AngularFirestore,private storage: Storage, private router: Router,) {
 
 
this.storage.get("userdetails").then((res) => {
  setTimeout(()=>{

  
  if (res != null) {
      if (res.adharno != null) {

this.makelogin(String(res.type),Number(res.adharno),Boolean(res.push),String(''))
    
        } else{
          this.isdataready=true;  

        }
      }else{
        this.isdataready=true;  

      }

    },2000)
   
  })

console.log(this.device_token)

 }



makelogin(mtype:string,adh:number,notify:boolean,dtoken:String){

  this.detailcollection = this.afs.collection<customers>(String(mtype), ref => ref.where('adharno', '==', Number(adh)).orderBy('created', 'desc'));
  this.details = this.detailcollection.snapshotChanges().pipe(
    map(actions =>
      actions.map(a => {
        //  const data =a.payload.doc.data() as customers

        const data = Object.assign(
          a.payload.doc.data() as customers,
          {
            odate: new Date(
              a.payload.doc.data().date.toDate()
            ).toLocaleDateString("en-GB")
          },
          { date: new Date(a.payload.doc.data().date.toDate()) },
          
        );

        const id = a.payload.doc.id;
        return { id, ...data };
      })
    )
  );
this.details.subscribe(async(res) => {

  if(res){
console.log(res)

  this.catmenu=String(mtype);
   this.data=await res;

   this.isdataready=true;

   if(notify){

res.forEach((dd,index)=>{
  this.afs.collection(String(mtype)).doc(String(dd.id)).update({token:dtoken}).then(()=>{
    if(index==this.data.length-1){
      this.isdataready=true;
      this.len = Object.keys(res).length;
     
  
    }
  })
})
}
}



 console.log(this.data)
  })

  
     
}




}
