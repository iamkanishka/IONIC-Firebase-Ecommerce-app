import { Component, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';
import { Platform,ActionSheetController } from '@ionic/angular';
import { Router, Navigation } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";

import { Observable } from "rxjs";
import { map, shareReplay, tap, startWith } from "rxjs/operators";

import { AlertController } from '@ionic/angular';

import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import * as firebase from "firebase/app";

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import * as moment from 'moment';


export interface batches {
  bid?: string;
  source: string;
  bname?: string;
  hper?: any;
  size?: any
  idate?: any;
  bdate?: any;
  ddate?: any;
  fmdate?: any;
  variety?: any;
  rdate?: any;
  price?: number;
  ridate?: any;
  rbdate?: any;
  rddate?: any;
  rfmdate?: any;
licno?:string;
  customers?: string[];
}

@Component({
  selector: 'app-placeord',
  templateUrl: './placeord.page.html',
  styleUrls: ['./placeord.page.scss'],

})



export class PlaceordPage implements OnInit {

  private batchcollection: AngularFirestoreCollection<batches>;
  batches: Observable<batches[]>;

mbatches:any[]=[]
realmbatches:any[]=[]
permbatches:any[]=[]


realdates:any;

sbatch:batches[]
showdetails:boolean=false;
showfilter:boolean=false;

showspin:boolean=true
showspinord:boolean=false;
showconto:boolean=false;
showcontd:boolean=false;
cusdata:any;

locopb:boolean=true
varopb:boolean=true
datopb:boolean=true

 opstates:any[]=[];
 opdistricts:any[]=[];
 optown:any[]=[];


orderplaced:boolean
ordering:boolean;
orderfailed:boolean;

showback:boolean=true;

showordstatus:boolean=true;

cus:string;

filter:any;
keyword:any;
checkit:number=0;

  constructor(private d:DataService, private afs: AngularFirestore,private router: Router, public alertController: AlertController
    ,private toast:ToastController, private storage: Storage, private fcm:FCM, private lno:LocalNotifications,private callNumber: CallNumber,
   private datePicker: DatePicker,public actionSheetController: ActionSheetController
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
      












      this.storage.get("userdetails").then((res) => {
        setTimeout(()=>{
this.cus=String(res.type);
        },2000)
      })

 
    console.log(this.d.data);
 this.getme()

  }

  ngOnInit() {

  
    
  }


getme(){
  setTimeout(() => {
  if(this.d.isdataready==true){
   
      
        this.cusdata=this.d.data
     if(this.d.data.length>=1){ 
     
    
    this.d.data.forEach((data,llindex)=>{
      this.batchcollection = this.afs.collection<batches>("batches", ref =>
      ref.where("licno", "==", String(data.licno)).orderBy('created', 'desc')
    );
    this.batches = this.batchcollection.snapshotChanges().pipe(
      
      map(actions =>
        actions.map(a => {
         
         
          const bdata = Object.assign(
            a.payload.doc.data() as batches,
          
    
            {
              ridate: new Date(
                a.payload.doc.data().idate.toDate()
              ).toLocaleDateString("en-GB")
            },
            {
              rfmdate: new Date(
                a.payload.doc.data().fmdate.toDate()
              ).toLocaleDateString("en-GB")
            },
    
            {
              rbdate: new Date(
                a.payload.doc.data().bdate.toDate()
              ).toLocaleDateString("en-GB")
            },
            {
              rddate: new Date(
                a.payload.doc.data().ddate.toDate()
              ).toLocaleDateString("en-GB")
            },
    
           
    
            { idate: new Date(a.payload.doc.data().idate.toDate()) },
            { fmdate: new Date(a.payload.doc.data().fmdate.toDate()) },
    
            { bdate: new Date(a.payload.doc.data().bdate.toDate()) },
            { ddate: new Date(a.payload.doc.data().ddate.toDate()) }
          );
    
          const id = a.payload.doc.id;
    
          return { id, ...bdata };
          
        })
      )
      
    );
    
    var  dada = new Date();
    var   tdate = new Date(dada.toDateString()).toLocaleDateString("en-GB");
    this.batches.subscribe((res)=>{
     console.log(res)
    
     this.checkit=this.checkit+1
    if(res!=null&&this.checkit<this.d.data.length+1&&res.length>0){
     res.forEach((add,aindex)=>{
     
      var a = moment(tdate, "DD/MM/YYYY");
      var b = moment(add.rddate, "DD/MM/YYYY");
      var hhdays = b.diff(a, "days");
      console.log(add.rddate, hhdays)

    if(hhdays<0){
    
      res.splice(aindex,1)
    }
  
    
    if(aindex==res.length-1){
    console.log(res)
if(res.length>0){
  
      this.mbatches.push(res);
    }
    }
     })
     
    }
    
    
    
    this.mbatches.forEach((mdata,mindex)=>{
    if(mdata.length>0){
      if(mdata[0].licno===res[0].licno){
     //this.mbatches.push(res);
     this.mbatches.splice(mindex,1,res)
    }
    }
    })
    
    
    
    console.log(this.mbatches);
    
    
    
    
    
    
    })
    
    
    if(llindex==this.d.data.length-1){
    console.log(this.mbatches);
    this.showcontd=true;
    this.showconto=true; 
    this.checkit=0
    
    this.showfilter=false;
    
    
    }
    
    })
    
     
    
     
    }else{
    
    
      this.router.navigate(['/home']);
    
    }

        }
  }, 3000);
    
}





  gobacktoorders(){
    this.router.navigate(['/orders']); 
  }
ordcusdata:any

batchdata:any;
quant:number;
total:number;

  async order(ordbdata:any){


    this.batchdata=ordbdata
console.log(ordbdata);
this.cusdata.forEach((data,index)=>{
 if( String(data.licno)==String(ordbdata.licno)){
this.ordcusdata=data;
 }
})
this.showspin=false;

const alert = await this.alertController.create({
  header: String(ordbdata.cname),
  subHeader: String(ordbdata.variety),
  message:"Enter less than or Equal to "+String(Number(ordbdata.size)-Number(ordbdata.sizeused))+"Quantity" ,
  inputs: [
   
    {
      name: 'quantity',
      type: 'number',
      min: 1,
      max: Number(Number(ordbdata.size)-Number(ordbdata.sizeused))
    },
   
  ],
  buttons: [
    {
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'secondary',
      handler: () => {
        console.log('Confirm Cancel');
this.showspin=true;
this.showspinord=false;

this.ordcusdata=null;


      }
    }, {
      text: 'Ok',
      handler:async (indata) => {
        this.quant=Number(indata.quantity)
        console.log('Confirm Ok');
this.total=Number(this.batchdata.price)*this.quant
        console.log(indata.quantity)
        if(Number(indata.quantity)<=Number(Number(ordbdata.size)-Number(ordbdata.sizeused))){
         setTimeout(()=>{
          this.showspin=false;
          this.showspinord=true;
          this.showdetails=true;
         },3000)
          
        }else{
          this.showspin=true;
          this.showspinord=false;



          const toast = await this.toast.create({
            message: 'Entered Quantity is Out of Bound',
            duration: 5000
          });
          toast.present()


        }
       

      }
    }
  ]
});

await alert.present();




}


async addemp() {

  // const npvalue = this.flform.value;
  //     const addvalue = this.addform.value;
  //     const lpvalue = this.pgform.value;
  //     const tsvalue = this.tsform.value;
  //     const empdet = { ...npvalue, ...addvalue, ...lpvalue,...tsvalue };
  //     const increment = firebase.firestore.FieldValue.increment(1);
  //  var senddata = this.afs.firestore.collection("supervisors").doc(`${Math.random()}`);
  //     var sendcc = this.afs.firestore.collection('maincounter').doc('maincounts');
  //     const totcount = this.afs.firestore.collection("maincounter").doc("maincounts");
  //     try {

  //       await firebase.firestore().runTransaction(transaction =>
  //         transaction.get(totcount).then(totdoc => {

  //           // console.log(totdoc.data().totord);
  //           const neweno: number = totdoc.data().empcounter + 1;

  //          const data: any[] = [];
  //           data['supno'] = neweno;

  //           transaction.set(senddata, { ...empdet, ...data, });
  //           transaction.set(sendcc, { supcounter: increment }, { merge: true })

  //         }))
  //         .catch(err => console.error(err));

  //     } catch (err) {
  //       console.error(err)
  //     }
  //     this.flform.reset();
  //     this.addform.reset();
  //     this.pgform.reset();
  //     this.tsform.reset();
  //     this.showaddc=false;

this.ordering=true;

this.showordstatus=false;

  //this.showcancel = false;
  const d=new Date();
  const ddddate = new Date(
    this.batchdata.ddate.toDateString()
  ).toLocaleDateString("en-GB")
  const ooodate = new Date(
    d.toDateString()
   ).toLocaleDateString("en-GB")

  const li = String(this.batchdata.licno);
  const data: any[] = [];
  const addmid = this.afs.createId();
  data["oid"] = addmid;
data["status"]="Pending";
  data["billed"] = true;
  data["deliverd"] = false;
  data['licno'] = li
  //plz make sure add elements in creating mobile app order
  data['platform'] = 'mob';
  data['custid'] = this.ordcusdata.id;
  data['ordcoid'] = this.ordcusdata.id
  data['cat'] = this.cus.charAt(0).toUpperCase() + this.cus.slice(1).slice(0, -1);
 
console.log(this.cus.charAt(0).toUpperCase() + this.cus.slice(1).slice(0, -1))
  data['adharno']=Number(this.ordcusdata.adharno);

  data['ooodate']=ooodate;
  data['ddddate']=ddddate;

  data['batid'] = String(this.batchdata.bid);
  //while mob order count dfls and add to order
data['index']=Number(this.ordcusdata.sdetails.length);
  // console.log(this.dflscount,typeof(this.dflscount));
data['fullname']=String(this.ordcusdata.fullname);
data['state']=String(this.ordcusdata.state);
data['district']=String(this.ordcusdata.district);
data['town']=String(this.ordcusdata.town);
data['village']=String(this.ordcusdata.village);
data['address']=String(this.ordcusdata.address);

data['variety']=String(this.batchdata.variety);
 data['ddate']=this.batchdata.ddate
 data['odate']=d;
data['dflscount']=this.quant;
  data['created'] = firebase.firestore.Timestamp.fromDate(new Date());
  data['obid'] = String(this.batchdata.bid);
  data["subtotal"] =this.total
  data['licno'] = li
  data["total"] = this.total;
  data["amt"] = this.total;
data['phone']=String(this.ordcusdata.phone)
data['price']=String(this.batchdata.price);
data['olicno']=String(this.ordcusdata.myuser.olicno);
data['pincode']=String(this.ordcusdata.pincode);
data['cname']=String(this.batchdata.cname);
data['token']=String(this.ordcusdata.token);


  console.log({ ...data })

  var sendcc = this.afs.firestore.collection('batches').doc(String(this.batchdata.bid));


  try {

    await firebase.firestore().runTransaction(transaction =>
      transaction.get(sendcc).then(totdoc => {

        //   // console.log(totdoc.data().totord);


        const rsize: number = Number(totdoc.data().size) - Number(totdoc.data().sizeused)
        console.log(rsize);
        const od: number = Number(this.quant);

        if (rsize >= od) {
          transaction.update(sendcc, { cuscount: firebase.firestore.FieldValue.increment(1), sizeused: firebase.firestore.FieldValue.increment(od), });


          const senddata = this.afs.firestore.collection("orders").doc(addmid);
          senddata
            .set({ ...data })
            .then(() => {

              var  dpayload = {
     
                "title": "Order Received",
                "body": String(this.batchdata.cname)+" has Received"+" your Order",
                "date":  Date.now()
               
           
          
          }
              this.afs.collection(String(this.cus)).doc(String(this.ordcusdata.id)).update({
                notifications: firebase.firestore.FieldValue.arrayUnion(dpayload)
              
              })



              const lil = String(this.ordcusdata.myuser.olicno);
              this.afs
                .collection("Ahomedetails")
                .doc(lil)
                .update({
                  utotord: firebase.firestore.FieldValue.increment(1),
                  uundelord: firebase.firestore.FieldValue.increment(1)
                })

                .then(() => {

console.log("orderplaced")
                     this.ordering=false;
                     this.orderplaced=true;
                     this.orderfailed=false;

             
                 // this.showcancel = true;
                });
            })
            .catch(err => {
              console.log(err);
              // this._snackBar.open(
              //   "Process Undone, Please Check your Internet Connection ",
              //   "OK",
              //   {
              //     duration: 15000
              //   }
              // );
              this.ordering=false;
              this.orderplaced=false;
              this.orderfailed=true;
            })



        } else {
          this.ordering=false;
          this.orderplaced=false;
          this.orderfailed=true;
       
      //    this.showcancel = true;

      
          // this._snackBar.open(
          //   "Please Enter Less than or Equal to " + rsize + " DFLS Count ",
          //   "OK",
          //   {
          //     duration: 10000
          //   }
          // );
        }
      }))



      .catch((err) =>{ console.error(err)
        this.ordering=false;
        this.orderplaced=false;
        this.orderfailed=true; 
      }
      );


  } catch (err) {
    console.error(err)
    this.ordering=false;
        this.orderplaced=false;
        this.orderfailed=true; 
  }









}


async callcrc(crcname:any,uname:any,phone:any){
  const alert = await this.alertController.create({
    header: String(crcname),
    subHeader: String(uname)+" - "+String(phone),
    message:"Would you like to make a Call",
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');

          // Object.assign(data[index].cropstatus[data[index].cropstatus.length-1], {

          //   status:"Running",

          // })

        }
      }, {
        text: 'Call',
        handler:  () => {

          this.callNumber.callNumber(String(phone), true)
          .then(res => console.log('Launched dialer!', res))
          .catch(err => console.log('Error launching dialer', err));

        }
      }
    ]
  });

  await alert.present(); 
}

async showlocopts(){



  const actionSheet = await this.actionSheetController.create({
    header: 'Location Types',
    subHeader:'Choose the Coresponding Type',
    cssClass: 'my-custom-class',
    buttons: [
      {
      text: 'State',
      icon: 'pin-outline',
      handler: () => {
        
      this.showss()
      },
    },
    {
      text: 'District',
      icon: 'pin-outline',
      handler: () => {
       this.showdd()
      }
    },
    {
      text: 'Town',
      icon: 'pin-outline',
      handler: () => {
  
        this.showtt()

      },
    },
    {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
        this.locopb=true
      }
    }
  
  ]
  });
  await actionSheet.present();

}

async showvaropts(){


  const actionSheet = await this.actionSheetController.create({
    header: 'Variety Types',
    subHeader:'Choose the Coresponding Variety',
    cssClass: 'my-custom-class',
    buttons: [{
      text: 'Cross Breed(CB)',
      icon: 'leaf-outline',
      handler: () => {
           this.varopb=false 
        this.mbatches.forEach((ulul,ulin)=>{
          this.mbatches[ulin]= ulul.filter((obj)=> {
            return obj['variety'] === 'Cross Breed(CB)';
          });
          
          })
      },
    },
    {
      text: 'Bivoltine(BV)',
      icon: 'leaf-outline',
      handler: () => {
        this.varopb=false 

        this.mbatches.forEach((ulul,ulin)=>{
          this.mbatches[ulin]= ulul.filter((obj)=> {
            return obj['variety'] === 'Bivoltine(BV)';
          });
          
          })
      },
    },
    {
      text: 'BV P1 Seed',
      icon: 'leaf-outline',
      handler: () => {
        this.varopb=false 

        this.mbatches.forEach((ulul,ulin)=>{
          this.mbatches[ulin]= ulul.filter((obj)=> {
            return obj['variety'] === 'BV P1 Seed';
          });
          
          })
      },
    },
    {
      text: 'Pure Mysore',
      icon: 'leaf-outline',
      handler: () => {
        this.varopb=false 

        this.mbatches.forEach((ulul,ulin)=>{
          this.mbatches[ulin]= ulul.filter((obj)=> {
            return obj['variety'] === 'Pure Mysore';
          });
          
          })
      },
    },
    {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }]
  });
  await actionSheet.present();

}
showcal(){

  this.datePicker.show({
    date: new Date(),
    mode: 'date',
    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
   }).then((date)=>{
     this.realdates=date
     console.log('Got date: ', date)
     this.varopb=false 
     this.mbatches.forEach((ulul,ulin)=>{
       this.mbatches[ulin]= ulul.filter((obj)=> {
         return obj['rddate'] === String(date.toLocaleDateString());
       });
       
       })


     
         })
   //.then(
  //  )

}


async showss(){


  this.opstates=[]

  console.log( this.opstates);
  this.mbatches.forEach((mm,mmindex)=>{
    if(this.opstates.length!=0){

      this.opstates.map((x)=>{
        var olt=x.text==mm[0].cstate
     
        if(!olt){
          this.opstates.push({
            text:mm[0].cstate,
            icon:'pin-outline',
            handler :()=>{
              this.locopb=false
             console.log('clicked '+mm[0].cstate)
           
              this.mbatches.forEach((ulul,ulin)=>{
              this.mbatches[ulin]= ulul.filter((obj)=> {
                return obj['cstate'] === mm[0].cstate;
              });
              if(this.mbatches[ulin].length==0){
                this.mbatches.splice(ulin,1)
              }
              
              })
        
            },
          })
        }
      })



         }else{
           this.opstates.push({
             text:mm[0].cstate,
             icon:'pin-outline',
             handler :  ()=>{
              this.locopb=false
              console.log('clicked '+mm[0].cstate)
           
              this.mbatches.forEach((ulul,ulin)=>{
              this.mbatches[ulin]= ulul.filter((obj)=> {
                return obj['cstate'] === mm[0].cstate;
              });
              if(this.mbatches[ulin].length==0){
                this.mbatches.splice(ulin,1)
              }
              })
         
             },
           })
         }
})
  var sactionSheet = await this.actionSheetController.create({
    header: 'States',
    subHeader:'Choose the Coresponding State',
    cssClass: 'my-custom-class',
    buttons: this.opstates
  });
  await sactionSheet.present()



  

}
async showdd(){
 


  
  this.opdistricts=[]

  this.mbatches.forEach((mm,mmindex)=>{
   console.log(mmindex);
   
    if(this.opdistricts.length!=0){
      console.log('fill')
      this.opdistricts.map((x)=>{
       
        
        var ol=x.text==mm[0].cdistrict
     if(!ol){
          this.opdistricts.push({
            text:mm[0].cdistrict,
            icon:'pin-outline',
            handler : ()=>{
              this.locopb=false
             console.log('clicked '+mm[0].cdistrict)
           
         this.mbatches.forEach((ulul,ulin)=>{
         this.mbatches[ulin]= ulul.filter((obj)=> {
           return obj['cdistrict'] === mm[0].cdistrict;
         });
         if(this.mbatches[ulin].length==0){
          this.mbatches.splice(ulin,1)
        }
         
         })
            },
          })
        }
      })


    }else{
      this.opdistricts.push({
        text:mm[0].cdistrict,
        icon:'pin-outline',
        handler :  ()=>{
         console.log('clicked'+mm[0].cdistrict)
         this.locopb=false
        
         this.mbatches.forEach((ulul,ulin)=>{
         this.mbatches[ulin]= ulul.filter((obj)=> {
           return obj['cdistrict'] === mm[0].cdistrict;
         });
         if(this.mbatches[ulin].length==0){
          this.mbatches.splice(ulin,1)
        }
         
         })

    
        },
      })
    }
   
 })
  
 var dactionSheet = await this.actionSheetController.create({
    header: 'Districts',
    subHeader:'Choose the Coresponding State',
    cssClass: 'my-custom-class',
    buttons: this.opdistricts
  });
  await dactionSheet.present()



}
async showtt(){

this.optown=[]

  this.mbatches.forEach((mm,mmindex)=>{
    if(this.optown.length!=0){
      this.optown.map((x)=>{
        var old=x.text==mm[0].ctown
     
        if(!old){
          this.optown.push({
            text:mm[0].ctown,
            icon:'pin-outline',
            handler : ()=>{
             console.log('clicked '+mm[0].ctown)
             this.locopb=false

             this.mbatches.forEach((ulul,ulin)=>{
             this.mbatches[ulin]= ulul.filter((obj)=> {
               return obj['ctown'] === mm[0].ctown;
             });
             if(this.mbatches[ulin].length==0){
              this.mbatches.splice(ulin,1)
            }
             })
        
            },
          })
        }
      })
         }
         
         else{
           this.optown.push({
             text:mm[0].ctown,
             icon:'pin-outline',
             handler :   ()=>{
              console.log('clicked '+mm[0].ctown)
              this.locopb=false

              
              this.mbatches.forEach((ulul,ulin)=>{
              this.mbatches[ulin]= ulul.filter((obj)=> {
                return obj['ctown'] === mm[0].ctown;
              });
              if(this.mbatches[ulin].length==0){
                this.mbatches.splice(ulin,1)
              }
              
              })

             },
           })
         }
 })

  
  var tactionSheet = await this.actionSheetController.create({
    header: 'Towns',
    subHeader:'Choose the Coresponding State',
    cssClass: 'my-custom-class',
    buttons: this.optown
  });
  await tactionSheet.present()
  

}






cancelfilter(){
this.locopb=true;
this.varopb=true;
this.datopb=true;

this.showconto=false;
this.showcontd=false;
this.mbatches=[]
this.getme()

}



canop(){
this.locopb=true;
this.varopb=true;
this.datopb=true;
this.showconto=false;
this.showcontd=false;
this.mbatches=[]
this.getme()

}
}
