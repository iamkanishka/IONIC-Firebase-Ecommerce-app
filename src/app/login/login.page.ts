import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Router, Navigation } from '@angular/router';

import { FormBuilder, FormGroup, Validators, } from "@angular/forms";
import { Storage } from '@ionic/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";

import { Observable } from "rxjs";
import { map, shareReplay, tap, startWith, } from "rxjs/operators";
import { DataService } from '../data/data.service';

import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';


import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  showslides: boolean
  showlog: boolean

  selection:string
  justtryadhar: boolean = false;

  logform: FormGroup;
  adhche: boolean = true;
  phoneche: boolean = true;

  gettype:boolean=true;

  private detailcollection: AngularFirestoreCollection<customers>;
  details: Observable<customers[]>;
  showlogbut: boolean = true;

  len: number = 0;
  mlen: number = 0;
  fivesec: boolean = false;

 
  cccat: District[] = [
    { value: "Customer" },
    { value: "Supervisor"  }
     
    
  
  ];
 
showback:boolean
logtype:string;

checknull:any

public device_token: String="";

  ruserdetails: object
  constructor(private platform: Platform, private router: Router, private afs: AngularFirestore, private fb: FormBuilder, private storage: Storage, public d: DataService
    ,private toast:ToastController,private loc:Location,  private fcm:FCM, ) {
      this.getToekn();
      this.getToekn();
      this.getToekn();



      this.router.navigateByUrl('/login',{skipLocationChange:true},).then(()=>{
        this.router.navigate([decodeURI(this.loc.path())])
      }) 



    this.storage.get("userdetails").then((res) => {
      setTimeout(() => {

        if(this.d.isdataready==true){
      this.checknull=res;

        if (res == null) {
          this.showslides = true;
          this.gettype=true;
          this.showback=true;
        } else {
          this.showback=false;
          this.gettype=false;
          
          this.showslides = false;
          this.logtype=String(res.type)
this.d.select=String(res.type)
console.log(this.d.select);


          console.log(res.type);
          console.log(this.logtype)
        }
        console.log(res);
        if (res != null) {


          console.log(this.showslides);
           if (res.adharno != null) {
            this.justtryadhar = false;
           
         this.gettype=true
              this.len = this.d.data.length;
              console.log(this.len, this.d.data)

              if (this.len >= 1) {
                this.fivesec = true;
          
              console.log(this.d.data);
              this.justtryadhar = false;
              this.router.navigate(['/home']);
            }else {
              this.fivesec = true;
              this.justtryadhar = false;
              this.router.navigate(['/']);
              
            }
            console.log('hi');
          setTimeout(() => {
              if (this.len == 0) {

                if (this.len >= 1) {
                  this.fivesec = true;
                  this.justtryadhar = true;
                  this.router.navigate(['/home']);
                } else {
                  this.justtryadhar = false;
                  this.fivesec = true;

                  this.router.navigate(['/']);

                }

              }
            }, 10000)
           

          }else{
            this.gettype=true;
          //  this.justtryadhar = false;
            this.fivesec = true;
console.log('138'+ this.fivesec)
this.logform.reset();
            
          }

        }else{
          //  this.justtryadhar = false;
            this.fivesec = true;
console.log('138'+ this.fivesec)
this.logform.reset();
            
          }
        }

      }, 5000)

    })


    // const details={
    //    introslides:false,
    //    adharno:"",
    //    phone:"",
    // }
    //       this.storage.set("userdetails",details)
    //       this.storage.get("userdetails").then((res)=>{
    //               this.ruserdetail= res;
    //               console.log(this.ruserdetail);
    //       })

    this.exit()

  }

  adob:any;
  phob:any;

  ngOnInit() {



  



    this.logform = this.fb.group({
      phone: [String(""), [Validators.required,Validators.maxLength(10),Validators.minLength(10)]],
      adharno: [String(""), [Validators.required,,Validators.maxLength(12),Validators.minLength(12)]],
      push: [Boolean("")],
      yytype:[String(""), ],
    });



console.log(this.logform.value)

  }

  
  
  getstarted() {
    this.showslides = false;

 }

  exit() {

    this.platform.backButton.subscribe(async () => {


      if (this.router.isActive('/home', true)) {
        // if (this.router.url === '/home') { 
        //  if (this.constructor.name=="LoginPage") {   
        navigator['app'].exitApp();
      }
    })

  }





  async getToekn() {

    this.fcm.subscribeToTopic('marketing');
  
    this.fcm.getToken().then(async(token) => {
  this.device_token=await token;
  
     
    })
    
   
    
    // this.fcm.onTokenRefresh().subscribe(token => {
   
    // });
    
    // this.fcm.unsubscribeFromTopic('marketing');
  }




// supsel(){
//   this.selection='Supervisor';
//   this.gettype = false;
//   }
  
//   cussel(){
//     this.selection='Customer';
//     this.gettype = false;
  
//   }
sel:string

showggg:boolean;


noti:any

realshow:string
makelogin() {


console.log(this.logform.value.yytype);

 
  if(this.d.isdataready){



if(this.checknull==null){
this.sel=String(this.logform.value.yytype).toLowerCase().concat('s');

this.realshow=this.logform.value.yytype.toUpperCase();

this.showlogbut = false;
console.log('hi');


this.showggg=true;


this.fcm.getToken().then(async(token) => {
this.device_token=await token;

this.d.makelogin(String(this.sel),Number(this.logform.value.adharno),Boolean(this.logform.value.push),String(token))

   
  })
//this.d.makelogin(String(this.sel),Number(this.logform.value.adharno),Boolean(this.logform.value.push),String(this.device_token))

console.log(this.d.isdataready)


  // this.d.data.forEach((data,index)=>{
  //   if(data.adharno==Number(this.logform.value.adharno)){

  //   }
  // })
  setTimeout(()=>{


console.log(this.d.data)
  this.mlen=this.d.data.length;

  if (this.mlen >= 1) {
    this.noti={
      notinum:0
    }
   
    this.ruserdetails = {
      type: this.sel,
     adharno: Number(this.logform.value.adharno),
     phone: Number(this.logform.value.phone),
     push:false
   }
   this.storage.set("noti", this.noti)

    this.storage.set("userdetails", this.ruserdetails).then(() => {
      this.storage.set("noti", this.noti)

    //     this.router.navigate(['/home']).then(()=>{
// this.logform.reset();
//       this.justtryadhar = true;
//       this.showlogbut = true;
//       this.logform.markAsPristine({})
//               })

this.logform.reset();
      this.justtryadhar = true;
      this.showlogbut = true;
      this.logform.markAsPristine({})

window.location.reload();

    })
  }else{
    this.router.navigate(['/login']).then(async()=>{
    const toast = await this.toast.create({
      message: 'No Registration/s found for this ADHAAR Number',
      duration: 5000
    });
    toast.present().then(()=>{
      this.logform.reset();
      this.gettype=true
      this.showlogbut = true;
    })
  })
  }

  

},5000)




}
else{


this.sel=String(this.logform.value.yytype).toLowerCase().concat('s');

this.showlogbut=false;
this.realshow=this.logform.value.yytype.toUpperCase();

this.showggg=true
this.fcm.getToken().then(async(token) => {
  this.device_token=await token;
this.d.makelogin(String(this.sel),Number(this.logform.value.adharno),Boolean(this.logform.value.push),String(token))
  
     
    })

// this.d.makelogin(String(this.sel),Number(this.logform.value.adharno),Boolean(this.logform.value.push),String(this.device_token))


console.log(this.sel)



setTimeout(()=>{


  
this.mlen = this.d.data.length;
console.log(this.mlen, this.d.data)
if (this.mlen >= 1) {

  this.noti={
    notinum:0
  }
 
  this.ruserdetails = {
    type: this.sel,
   adharno: Number(this.logform.value.adharno),
   phone: Number(this.logform.value.phone),
   push:false
 }
 this.storage.set("noti", this.noti)


  this.storage.set("userdetails", this.ruserdetails).then(() => {
    this.storage.set("noti", this.noti)
//     this.router.navigate(['/home']).then(()=>{
// this.logform.reset();
//       this.justtryadhar = true;
//       this.showlogbut = true;
//       this.logform.markAsPristine({})
//               })

this.logform.reset();
      this.justtryadhar = true;
      this.showlogbut = true;
      this.logform.markAsPristine({})
window.location.reload();

  })
}else{
  this.router.navigate(['/login']).then(async()=>{
  const toast = await this.toast.create({
    message: 'No Registration/s found for this ADHAAR Number',
    duration: 5000
  });
  toast.present().then(()=>{
    this.logform.reset();
this.gettype=true
    this.showlogbut = true;
  })
})
}

},5000)

}
}


this.d.select=this.sel
}



gotoregister(){
  this.router.navigate(['/register']);
}

}
