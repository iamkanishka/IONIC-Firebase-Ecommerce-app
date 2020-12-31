import { Component, ViewChildren, QueryList } from '@angular/core';
import { Platform,IonRouterOutlet, AlertController, MenuController } from '@ionic/angular';

import { Router } from '@angular/router';

import { DataService } from '../data/data.service';
import { Storage } from '@ionic/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";

import { Observable } from "rxjs";


import { FCM } from '@ionic-native/fcm/ngx';
import { map, shareReplay, tap, startWith, } from "rxjs/operators";

import { HttpClient } from "@angular/common/http";

import { ToastController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FormBuilder, FormGroup,Validators, } from '@angular/forms';

export interface customers {
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

}
export class District {
  value: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  public appPages = [];

  regcrc:boolean=false;

editme:boolean=true

selection:string


districts: District[] = []
towns: District[] = []
states: District[] = []


len:number

item:any;
showcont:boolean=false;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  private detailcollection: AngularFirestoreCollection<customers>;
  details: Observable<customers[]>;

  cusregform: FormGroup;
  supregform: FormGroup;


  fullname:string;
  phone:number;
  adharnum:number;
  crcnum:number=0;
catog:string;

crossbreed:number=0;
bivoltine:number=0;
bvp1seed:number=0;
puremysore:number=0;

logdetail:any;

cccat: District[] = [
  { value: "Primary" },
  { value: "Secondary"  }
   
  

];

notinum:number=0;

loadregcrc:boolean=false


nnnumber:number

private crccollection: AngularFirestoreCollection<any>;
crcs: Observable<any[]>;

showdetailsnum:boolean=false;

    constructor(private platform: Platform,
      private router: Router,
      private toast:ToastController,
       private afs: AngularFirestore, 
       private storage: Storage,
       private d: DataService,
   private fcm:FCM,
       public alertController: AlertController, private lno:LocalNotifications,  private menu: MenuController,
       private fb: FormBuilder,private http: HttpClient ) {


        console.log(this.d.catmenu)


    





// this.exit();


// this.getToekn()


//console.log(this.d.data)


// this.storage.get("noti").then((nnres) => {
 
// this.nnnumber=nnres.notinum
 

// })



this.http.get('assets/states.csv', { responseType: 'text' })
.subscribe(
  data => {
    let csvToRowArray = data.split("\n");
    for (let index = 1; index < csvToRowArray.length - 1; index++) {
      let row = csvToRowArray[index].split(",");

      this.states.push({ value: row[0] });
    }
    console.log(this.states);
    console.log({ ...this.states })
  },
  error => {
    console.log(error);
  }
);



this.http.get('assets/districts.csv', { responseType: 'text' })
.subscribe(
  data => {
    let csvToRowArray = data.split("\n");
    for (let index = 1; index < csvToRowArray.length - 1; index++) {
      let row = csvToRowArray[index].split(",");

      this.districts.push({ value: row[0] });
    }
    console.log(this.districts);
    console.log({ ...this.districts })
  },
  error => {
    console.log(error);
  }
);



this.http.get('assets/taluk.csv', { responseType: 'text' })
.subscribe(
  data => {
    let csvToRowArray = data.split("\n");
    for (let index = 1; index < csvToRowArray.length - 1; index++) {
      let row = csvToRowArray[index].split(",");

      this.towns.push({ value: row[0] });
    }
    console.log(this.towns);
    console.log({ ...this.towns })
  },
  error => {
    console.log(error);
  }
);


this.storage.get("noti").then((nnres) => {
  this.nnnumber=nnres.notinum
})
 

this.fcm.onNotification().subscribe(data => {
 
  if(data.wasTapped){
    console.log("Received in background");
  
    this.storage.get("noti").then((nnres) => {
    
  
   var noti={
    notinum: nnres.notinum+1
  }

  this.storage.set("noti", noti)
     
  this.nnnumber=nnres.notinum+1;
    
    })

  
  
  } else {
  


    this.storage.get("noti").then((nnres) => {
     
  
   var noti={
    notinum: nnres.notinum+1
  }

  this.storage.set("noti", noti)
  this.nnnumber=nnres.notinum+1

    
    })

   

    console.log("Received in foreground");

    this.lno.schedule([{
      text: data.subtitle,
    title:data.title,

    }]);

  };
});



  this.storage.get("userdetails").then((res) => {
    setTimeout(() => {

console.log(this.d.data)







if(this.d.isdataready){

  this.catog=this.d.data[0].cat

  this.fullname=this.d.data[0].fullname;
  this.phone=this.d.data[0].phone;
 this.adharnum=this.d.data[0].adharno;

 this.crcnum=this.d.data.length;

this.d.data.forEach((adata,index)=>{
if(adata.sdetails.length!=0){
adata.sdetails.forEach((sdata,sindex)=>{
if(sdata.orderdetails.variety=="Cross Breed(CB)"){
  this.crossbreed=this.crossbreed+Number(sdata.orderdetails.dflscount);
}
if(sdata.orderdetails.variety=="Bivoltine(BV)"){
  this.bivoltine=this.bivoltine+Number(sdata.orderdetails.dflscount);
}
if(sdata.orderdetails.variety=="BV P1 Seed"){
  this.bvp1seed=this.bvp1seed+Number(sdata.orderdetails.dflscount);
  
}
if(sdata.orderdetails.variety=="Pure Mysore"){
  this.puremysore=this.puremysore+Number(sdata.orderdetails.dflscount);
  
}

})
}
if(index==this.d.data.length-1){
  this.showdetailsnum=true;
}
})


  this.len = this.d.data.length;
 
  console.log(this.len, res)


 
  if(this.len>=1){
  
    this.showcont=true;
  }else{
    if (this.router.isActive('/home',true) ){
      // if (this.router.url === '/home') {    
     // navigator['app'].exitApp();
     const details={
       type:null,
      adharno:null,
        phone:null,
     }
                 const alert =  this.alertController.create({
                header: 'SmartCRC',
                message: 'You have no Registration with any User!!!...',
                buttons: [
                  {
                    text: 'ok',
                    handler: async() => {
                   //   console.log('Confirm Okay');
                   const toast = await this.toast.create({
                    message: 'Closing App...',
                    duration: 5000
                  });
                  toast.present().then(()=>{
                    this.storage.set("userdetails",details).then(()=>{
                    navigator['app'].exitApp();
                  })
                  })
                    }
                  }
                ]
              });
          
    
          
    
          
            //  navigator['app'].exitApp();
        

      }

  
  }
}

 


    },5000)
  })

}

// public device_token: String;
// async getToekn() {

//   this.fcm.subscribeToTopic('marketing');

//   this.fcm.getToken().then(async(token) => {
// this.device_token=await token;

   
//   });
  
//   this.fcm.onNotification().subscribe(data => {
   
//     if(data.wasTapped){
//       console.log("Received in background");
//     } else {
//       console.log("Received in foreground");
//     };
//   });
  
//   // this.fcm.onTokenRefresh().subscribe(token => {
 
//   // });
  
//   // this.fcm.unsubscribeFromTopic('marketing');
// }


// sure:boolean=false
// update(){
//   this.d.data.forEach((cdata,index)=>{
//   this.afs.collection('customers').doc(String(cdata.id)).update({token:this.device_token}).then(()=>{
//     if(index==this.d.data.length-1){
// this.sure=true;      
//     }
//   })
    
//   })
// }






ngOnInit() {



  this.cusregform = this.fb.group({
    fullname: [String(""), [Validators.required]],
    phone: [String(""), [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
   
    address: [String(""), [Validators.required,]],
    state: [String(""), [Validators.required,]],
    pincode: [String(""), [Validators.required,]],
    district: [String(""), [Validators.required,]],
    town: [String(""), [Validators.required,]],
    land: [String(""), [Validators.required,]],
    culttype: [String(""), [Validators.required,]],
    village: [String(""), [Validators.required,]],


   
  });



  this.supregform = this.fb.group({
    fullname: [String(""), [Validators.required]],
    phone: [String(""), [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
  
    address: [String(""), [Validators.required,]],
    state: [String(""), [Validators.required,]],
    pincode: [String(""), [Validators.required,]],
    district: [String(""), [Validators.required,]],
    town: [String(""), [Validators.required,]],

    village: [String(""), [Validators.required,]],


  });

 


}




 


exit(){

  this.platform.backButton.subscribe(async () => {
  //  if (this.constructor.name=="HomePage") { 
   
   if (this.router.isActive('/home',true) ){
    // if (this.router.url === '/home') {    
    navigator['app'].exitApp();
    }

if(this.regcrc){

}



  })

}



mbatches:any[]=[]

checkit:number=0

showcrcs:boolean=false;

searchcrc() {

  this.regcrc=true


  this.mbatches = []


this.loadregcrc=true;



  if (this.d.data.length >= 1) {


    this.d.data.forEach((ksdata, llindex) => {


      var re = /\/|\.|\_/gi;
      var str = String(ksdata.licno);
      var newstr = str.replace(re, "");
  


      console.log(ksdata)
      this.crccollection = this.afs.collection<any>("Ahomedetails", ref =>
        ref.where("aolicno", "==", String(newstr).trim())
      );
      this.crcs = this.crccollection.snapshotChanges().pipe(

        map(actions =>
          actions.map(a => {

            console.log(a.payload.doc.data() as any);

            const bdata = a.payload.doc.data() as any

            const id = a.payload.doc.id;

            return { id, ...bdata,...ksdata };

          })
        )

      );
      this.crcs.subscribe((res) => {


        console.log(res)
        


        // this.mbatches.push(arrdata);
        this.checkit = this.checkit + 1
        if (res != null && this.checkit < this.d.data.length + 1) {
          this.mbatches.push(...res);

        }

        // this.mbatches.forEach((mdata,mindex)=>{
        // if(mdata[0].alicno===res[0].alicno){
        //  //this.mbatches.push(res);
        //  this.mbatches.splice(mindex,1,res)


        // }
        // })




        this.mbatches.forEach((mdata, mindex) => {
          if (mdata.alicno === res[0].alicno) {


              Object.assign(this.mbatches[mindex], {




                zbvrating: res[0].zbvrating,

                zcbrating: res[0].zcbrating,

                zp1rating: res[0].zp1rating,

                zpurating: res[0].zpurating,

                zrcountbv: res[0].zrcountbv,

                zrcountcb: res[0].zrcountcb,

                zrcountp1: res[0].zrcountp1,

                zrcountpu: res[0].zrcountpu,

                ztbvtot: res[0].ztbvtot,

                ztcbtot: res[0].ztcbtot,


                ztp1tot: res[0].ztp1tot,

                ztputot: res[0].ztputot,


                 





              })





            //this.mbatches.push(res);
            //  this.mbatches.splice(mindex,1,res)


          }
        })




      })


      if (llindex == this.d.data.length - 1) {
        console.log(this.mbatches);
        // this.showcontd=true;
        // this.showconto=true; 
        this.checkit = 0
        this.showcrcs = true;

        this.loadregcrc=true;

      }

    })




  } else {

  }

}



gotoregister(){
  this.router.navigate(['/register']);
}


gotonoti(){
  this.router.navigate(['/notifications']).then(()=>{
     var noti={
      notinum:0
    }
    this.storage.set("noti",noti) 
  })
}

dupdate:any

load(dataa:any){
  this.selection=dataa.cat
  console.log(dataa);
  
this.dupdate=dataa;

this.editme=false;


if(dataa.cat=='CUSTOMER'){
this.cusregform.patchValue({
  fullname: dataa.fullname,
  address:dataa.address,

phone:dataa.phone,
  state:dataa.state,
    pincode: dataa.pincode,
    district: dataa.district,
    town: dataa.town,
    land: dataa.land,
    culttype:dataa.culttype,
    village:dataa.village,

});
}



if(dataa.cat=='SUPERVISOR'){
  this.supregform.patchValue({
    firstName: dataa.fullname,
    address:dataa.address,
  
  phone:dataa.phone,
    state:dataa.state,
      pincode: dataa.pincode,
      district: dataa.district,
      town: dataa.town,
     village:dataa.village

  });
  }


}

loadit:boolean=false;

edit(llll:any)
{

if(llll.cat=="CUSTOMER"){
  this.loadit=true;

  this.afs.collection('customers').doc(String(llll.id)).update({...this.cusregform.value}).then(()=>{
    this.editme=true;
    this.regcrc=false;
this.loadit=false;

  })

}
if(llll.cat=="SUPERVISOR"){
this.loadit=true;

  this.afs.collection('supervisors').doc(String(llll.id)).update({...this.supregform.value}).then(()=>{
this.editme=true;
this.regcrc=false;
this.loadit=false;

  })

}

}

logout(){

  if (this.router.isActive('/home',true) ){
    // if (this.router.url === '/home') {    
   // navigator['app'].exitApp();

   this.storage.get("userdetails").then((res) => {

this.logdetail=res;
Object.assign(this.logdetail, {
type:null,
adharno:null,
phone:null,     
});

   })
   
  
   
   
          this.menu.toggle().then(async()=>{
            const alert = await this.alertController.create({
              header: 'SmartCRC',
              message: 'Do you want to <b> Logout </b> and <b> Close </b> the App?...',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'dark',
                  handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                  }
                }, {
                  text: 'LogOut',
                  handler: async() => {
                 //   console.log('Confirm Okay');
                 const toast = await this.toast.create({
                  message: 'Logging Out...',
                  duration: 5000
                });
                toast.present().then(()=>{
                  this.storage.set("userdetails",this.logdetail).then(()=>{
                
                    navigator['app'].exitApp();
                })
                })
                  }
                }
              ]
            });
        
            await alert.present();
        
          })
        
          //  navigator['app'].exitApp();
      

    }



         
}
}
