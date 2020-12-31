import { Component, OnInit } from '@angular/core';
import { Platform, NavController, ToastController } from '@ionic/angular';
import { Router, Navigation } from '@angular/router';
import { DataService } from '../data/data.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

import * as firebase from "firebase/app";


import { LoadingController } from '@ionic/angular';

import { Observable, merge } from "rxjs";
import { map, shareReplay, tap, startWith, } from "rxjs/operators";

import { Storage } from '@ionic/storage';

import { AlertController } from '@ionic/angular';

import { HttpClient } from "@angular/common/http";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';



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
  ddate?: any;
  village?: string;
  licno?: string;

}
export interface orders {

  fullname?: string;

  phone?: number;
  address?: string;
  state?: string;
  district: string;
  variety: string;
  ordate: string;
  date?: any;
  orodate?: any;
  odate?: any;
  ddate?: any;
  orddate: any;
}


export class Markets {
  value: string;
}
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {


  private cropmarket: AngularFirestoreDocument<any>;
  cmobs: Observable<any>;
  marselected: any;

  private detailcollection: AngularFirestoreCollection<customers>;
  details: Observable<customers[]>;


  private orderscollection: AngularFirestoreCollection<orders>;
  orders: Observable<orders[]>;

  len: number;
  olen: number;

  logform: FormGroup;
myrating:number

  updatesdetails: any;
  updateindex: number;

  showorder: boolean = true;
  showdetails: boolean = false;


  showtheorders: any;

  showcontent: any;

  dorddata: customers[]
  orddata: orders[];
  showconto: boolean = false;
  showcontd: boolean = false;

  markets: Markets[] = []
  getmarinfo: boolean = false;

  public form: FormGroup;

  

  constructor(private platform: Platform, private router: Router, public d: DataService, private storage: Storage, private afs: AngularFirestore, private loadingController: LoadingController, public alertController: AlertController, private toast: ToastController,
    private http: HttpClient, private fb: FormBuilder, private fcm: FCM, private lno: LocalNotifications) {
    // this.platform.backButton.subscribe((res) => {
    //   this.router.navigate(['/home']);
    // })


    
    this.form = this.fb.group({
      rating: ['', Validators.required],
    })


    // this.form.valueChanges.subscribe((vres) => {
    //   console.log(vres);

    // })






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
    




    this.showtheorders = this.d.data;



    this.storage.get("userdetails").then((res) => {
      //setTimeout(() => {
        var ttt = res.type
        var getbytype: string = ttt[0].toUpperCase() + ttt.slice(1).slice(0, -1);
        console.log(getbytype);


        this.orderscollection = afs.collection<orders>("orders", ref => ref.where('adharno', '==', Number(res.adharno)).where('billed', '==', true).where('cat', '==', getbytype).orderBy('created', 'desc'));
        this.orders = this.orderscollection.snapshotChanges().pipe(
          map(actions =>
            actions.map(a => {

              const data = Object.assign(
                a.payload.doc.data() as orders,

                {
                  orddate: new Date(
                    a.payload.doc.data().ddate.toDate()
                  ).toLocaleDateString("en-GB")
                },
                {
                  orodate: new Date(
                    a.payload.doc.data().odate.toDate()
                  ).toLocaleDateString("en-GB")
                },
                { odate: new Date(a.payload.doc.data().odate.toDate()) },
                { ddate: new Date(a.payload.doc.data().ddate.toDate()) }
              );
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        );

        this.orders.subscribe((res) => {
          console.log(res)
          this.orddata = res
          this.showconto = true;
        })

        if (this.d.isdataready) {

          console.log(this.d.data);

          this.len = this.d.data.length;
  if (this.len >= 1) {

            //      this.dorddata = this.d.data

            this.showcontd = true;


            console.log(this.showcontd)


            console.log(this.len);

          } else {

            this.router.navigate(['/home']);

          }
        }

     // }, 5000)
    })

    console.log(this.d.data)




  }

  ngOnInit() {

    this.logform = this.fb.group({
      quant: [String(""), [Validators.required, Validators.min(1)]],
      price: [String(""), [Validators.required, Validators.min(1)]],
      marname: [String(""), [Validators.required]],

    });



  }
  createorder() {
    console.log(this.d.data)
    if (this.d.batch.length == 0) {
      this.d.data.forEach((data, index) => {
        this.d.batch.push(data.licno)
      })
    }

    this.router.navigate(['/placeord']);

  }



  porfid: string

  showmarket: boolean = false
  rescropmarket: any
  v: string;


  realv: string;

  showorddetails(data: any, id: string) {

    this.markets = [];


    console.log(data);





    if (data.rating != String) {
      this.form.patchValue({
        rating: Number(data.rating)
      })
    }



    this.http.get('assets/' + String(data.orderdetails.variety) + '.csv', { responseType: 'text' })
      .subscribe(
        data => {
          let csvToRowArray = data.split("\n");
          for (let index = 1; index < csvToRowArray.length - 1; index++) {
            let row = csvToRowArray[index].split(",");

            this.markets.push({ value: row[0] });
          }
          console.log(this.markets);
          console.log({ ...this.markets })
        },
        error => {
          console.log(error);
        }
      );

    this.porfid = id;
    this.showorder = false;
    this.showcontent = data;


    setTimeout(() => {
      this.showdetails = true;


    }, 1500);

  }



  passstatus: boolean = true;

  async passed(data: any, index: number) {

    var d = new Date();
    const tdate = new Date(
      d.toDateString()
    ).toLocaleDateString("en-GB");
    switch (data[index].cropstatus.length) {

      case 1: {
        const alert = await this.alertController.create({
          header: 'Update Confirm',
          message: 'Do You Want to <strong>Update</strong> the <strong>Status</strong>?',
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
              text: 'Update',
              handler: async () => {
                const loading = await this.loadingController.create({

                  message: 'Updating Status,Please wait...',
                  duration: 3000,
                });
                await loading.present().then(async () => {
           

                  Object.assign(data[index].cropstatus[data[index].cropstatus.length - 1], {

                    status: "Passed",
                    date: tdate,
                  })
                  data[index].cropstatus.push({ stage: "3rd Instar", status: "Running" ,duration:"3-3.5 Days"})


                  var upcus = this.afs.firestore.collection('customers').doc(String(this.porfid));


                  try {
                    firebase.firestore().runTransaction(transaction =>
                      transaction.get(upcus).then(async(totdoc) => {
      
      
                        var ss:any[]=totdoc.data().sdetails;
                        Object.assign(ss[index].cropstatus[ss[index].cropstatus.length - 1], {

                          status: "Passed",
                          date: tdate,
                        })
                        ss[index].cropstatus.push({ stage: "3rd Instar", status: "Running" ,duration:"3-3.5 Days"})
                        transaction.update(upcus, { sdetails: ss })
                        const toast = await this.toast.create({
                          message: 'Status Updated',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
                          this.passstatus = false
    
                          console.log('done')
                        })
          
                      }))
                      .catch(async (err) => {
                        console.error(err)
                        this.logform.reset();
          
                        const toast = await this.toast.create({
                          message: 'Sorry could not Update...Try Again',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
    
                        })
                      }
                      );
          
          
          
                  } catch (err) {
                    console.error(err)
                    const toast = await this.toast.create({
                      message: 'Sorry could not Update...Try Again',
                      duration: 2000
                    });
                    toast.present().then(() => {


                    })
          
                  }


                })


              }
            }
          ]
        });

        await alert.present();

        break;
      }




      case 2: {
        const alert = await this.alertController.create({
          header: 'Update Confirm',
          message: 'Do You Want to <strong>Update</strong> the <strong>Status</strong>?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {


                // Object.assign(data[index].cropstatus[data[index].cropstatus.length-1], {

                //   status:"Running",

                // })
                //  console.log('Confirm Cancel: blah');
              }
            }, {
              text: 'Update',
              handler: async () => {
                const loading = await this.loadingController.create({
                  message: 'Updating Status,Please wait...',
                  duration: 3000,
                });
                await loading.present().then(async () => {

                  Object.assign(data[index].cropstatus[data[index].cropstatus.length - 1], {

                    status: "Passed",
                    date: tdate,
                  })
                  data[index].cropstatus.push({ stage: "4th Instar", status: "Running",duration:"4-6 Days" })
      

                  var upcus = this.afs.firestore.collection('customers').doc(String(this.porfid));


                  try {
                    firebase.firestore().runTransaction(transaction =>
                      transaction.get(upcus).then(async(totdoc) => {
      
      
                        var ss:any[]=totdoc.data().sdetails;
                        Object.assign(ss[index].cropstatus[ss[index].cropstatus.length - 1], {

                          status: "Passed",
                          date: tdate,
                        })
                        ss[index].cropstatus.push({ stage: "4th Instar", status: "Running",duration:"4-6 Days" })
                        transaction.update(upcus, { sdetails: ss })
                        const toast = await this.toast.create({
                          message: 'Status Updated',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
                          this.passstatus = false
    
                          console.log('done')
                        })
          
                      }))
                      .catch(async (err) => {
                        console.error(err)
                        this.logform.reset();
          
                        const toast = await this.toast.create({
                          message: 'Sorry could not Update...Try Again',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
    
                        })
                      }
                      );
          
          
          
                  } catch (err) {
                    console.error(err)
                    const toast = await this.toast.create({
                      message: 'Sorry could not Update...Try Again',
                      duration: 2000
                    });
                    toast.present().then(() => {


                    })
          
                  }



                })


              }
            }
          ]
        });

        await alert.present();

        break;
      }



      case 3: {
        const alert = await this.alertController.create({
          header: 'Update Confirm',
          message: 'Do You Want to <strong>Update</strong> the <strong>Status</strong>?',
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
              text: 'Update',
              handler: async () => {
                const loading = await this.loadingController.create({
                  message: 'Updating Status,Please wait...',
                  duration: 3000,
                });
                await loading.present().then(async () => {
                  Object.assign(data[index].cropstatus[data[index].cropstatus.length - 1], {

                    status: "Passed",
                    date: tdate,
                  })
                  data[index].cropstatus.push({ stage: "5th Instar", status: "Running",duration:"7-8 Days" })
                
             

                  var upcus = this.afs.firestore.collection('customers').doc(String(this.porfid));


                  try {
                    firebase.firestore().runTransaction(transaction =>
                      transaction.get(upcus).then(async(totdoc) => {
      
      
                        var ss:any[]=totdoc.data().sdetails;
                        Object.assign(ss[index].cropstatus[ss[index].cropstatus.length - 1], {

                          status: "Passed",
                          date: tdate,
                        })
                        ss[index].cropstatus.push({ stage: "5th Instar", status: "Running",duration:"7-8 Days" })
                        transaction.update(upcus, { sdetails: ss })
                        const toast = await this.toast.create({
                          message: 'Status Updated',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
                          this.passstatus = false
    
                          console.log('done')
                        })
          
                      }))
                      .catch(async (err) => {
                        console.error(err)
                        this.logform.reset();
          
                        const toast = await this.toast.create({
                          message: 'Sorry could not Update...Try Again',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
    
                        })
                      }
                      );
          
          
          
                  } catch (err) {
                    console.error(err)
                    const toast = await this.toast.create({
                      message: 'Sorry could not Update...Try Again',
                      duration: 2000
                    });
                    toast.present().then(() => {


                    })
          
                  }


                })


              }
            }
          ]
        });

        await alert.present();

        break;
      }

      case 4: {
        const alert = await this.alertController.create({
          header: 'Update Confirm',
          message: 'Do You Want to <strong>Update</strong> the <strong>Status</strong>?',
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
              text: 'Update',
              handler: async () => {
                const loading = await this.loadingController.create({
                  message: 'Updating Status,Please wait...',
                  duration: 3000,
                });
                await loading.present().then(async () => {

                  Object.assign(data[index].cropstatus[data[index].cropstatus.length - 1], {

                    status: "Passed",
                    date: tdate,
                  })
                  data[index].cropstatus.push({ stage: "Mounting", status: "Running",duration:"2-3 Days" })

                  var upcus = this.afs.firestore.collection('customers').doc(String(this.porfid));


                  try {
                    firebase.firestore().runTransaction(transaction =>
                      transaction.get(upcus).then(async(totdoc) => {
      
      
                        var ss:any[]=totdoc.data().sdetails;
                        Object.assign(ss[index].cropstatus[ss[index].cropstatus.length - 1], {

                          status: "Passed",
                          date: tdate,
                        })
                        ss[index].cropstatus.push({ stage: "Mounting", status: "Running",duration:"2-3 Days" })
                        transaction.update(upcus, { sdetails: ss })
                        const toast = await this.toast.create({
                          message: 'Status Updated',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
                          this.passstatus = false
    
                          console.log('done')
                        })
          
                      }))
                      .catch(async (err) => {
                        console.error(err)
                        this.logform.reset();
          
                        const toast = await this.toast.create({
                          message: 'Sorry could not Update...Try Again',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
    
                        })
                      }
                      );
          
          
          
                  } catch (err) {
                    console.error(err)
                    const toast = await this.toast.create({
                      message: 'Sorry could not Update...Try Again',
                      duration: 2000
                    });
                    toast.present().then(() => {


                    })
          
                  }


                  
               
                })


              }
            }
          ]
        });

        await alert.present();

        break;
      }

      case 5: {
        const alert = await this.alertController.create({
          header: 'Update Confirm',
          message: 'Do You Want to <strong>Update</strong> the <strong>Status</strong>?',
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
              text: 'Update',
              handler: async () => {
                Object.assign(data[index].cropstatus[data[index].cropstatus.length - 1], {

                  status: "Passed",
                  date: tdate,
                })
                data[index].cropstatus.push({ stage: "Spinning", status: "Running",duration:"2-3 Days" })

                const loading = await this.loadingController.create({
                  message: 'Updating Status,Please wait...',
                  duration: 3000,
                });
                await loading.present().then(async () => {
  var upcus = this.afs.firestore.collection('customers').doc(String(this.porfid));


                  try {
                    firebase.firestore().runTransaction(transaction =>
                      transaction.get(upcus).then(async(totdoc) => {
      
      
                        var ss:any[]=totdoc.data().sdetails;
                        Object.assign(ss[index].cropstatus[ss[index].cropstatus.length - 1], {

                          status: "Passed",
                          date: tdate,
                        })
                        ss[index].cropstatus.push({ stage: "Spinning", status: "Running",duration:"2-3 Days" })
                        transaction.update(upcus, { sdetails: ss })
                        const toast = await this.toast.create({
                          message: 'Status Updated',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
                          this.passstatus = false
    
                          console.log('done')
                        })
          
                      }))
                      .catch(async (err) => {
                        console.error(err)
                        this.logform.reset();
          
                        const toast = await this.toast.create({
                          message: 'Sorry could not Update...Try Again',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
    
                        })
                      }
                      );
          
          
          
                  } catch (err) {
                    console.error(err)
                    const toast = await this.toast.create({
                      message: 'Sorry could not Update...Try Again',
                      duration: 2000
                    });
                    toast.present().then(() => {


                    })
          
                  }


                })


              }
            }
          ]
        });

        await alert.present();

        break;
      }

      case 6: {
        const alert = await this.alertController.create({
          header: 'Update Confirm',
          message: 'Do You Want to <strong>Update</strong> the <strong>Status</strong>?',
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
              text: 'Update',
              handler: async () => {
                const loading = await this.loadingController.create({
                  message: 'Updating Status,Please wait...',
                  duration: 3000,
                });
                await loading.present().then(async () => {

                  Object.assign(data[index].cropstatus[data[index].cropstatus.length - 1], {

                    status: "Passed",
                    date: tdate,
                  })
                  data[index].cropstatus.push({ stage: "Harvesting", status: "Running",duration:"2 Days" })



                  var upcus = this.afs.firestore.collection('customers').doc(String(this.porfid));


                  try {
                    firebase.firestore().runTransaction(transaction =>
                      transaction.get(upcus).then(async(totdoc) => {
      
      
                        var ss:any[]=totdoc.data().sdetails;
                        Object.assign(ss[index].cropstatus[ss[index].cropstatus.length - 1], {

                          status: "Passed",
                          date: tdate,
                        })
                        ss[index].cropstatus.push({ stage: "Harvesting", status: "Running",duration:"2 Days" })
                        transaction.update(upcus, { sdetails: ss })
                        const toast = await this.toast.create({
                          message: 'Status Updated',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
                          this.passstatus = false
    
                          console.log('done')
                        })
          
                      }))
                      .catch(async (err) => {
                        console.error(err)
                        this.logform.reset();
          
                        const toast = await this.toast.create({
                          message: 'Sorry could not Update...Try Again',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
    
                        })
                      }
                      );
          
          
          
                  } catch (err) {
                    console.error(err)
                    const toast = await this.toast.create({
                      message: 'Sorry could not Update...Try Again',
                      duration: 2000
                    });
                    toast.present().then(() => {


                    })
          
                  }



                })


              }
            }
          ]
        });

        await alert.present();

        break;
      }





      case 7: {
        const alert = await this.alertController.create({
          header: 'Cacoon Details',
          //subHeader: '',
          message: 'Enter the Produced Cacoon Qunatity',
          inputs: [

            {
              name: 'cacoon',
              type: 'number'
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {

                // Object.assign(data[index].cropstatus[data[index].cropstatus.length-1], {

                //   status:"Running",

                // })
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Ok',
              handler: async (indata) => {
                console.log('Confirm Ok');
                console.log(indata.cacoon);

                const loading = await this.loadingController.create({
                  message: 'Updating Status,Please wait...',
                  duration: 3000,
                });
                await loading.present().then(async () => {

                  data[index].cacoon = Number(indata.cacoon)


                  Object.assign(data[index].cropstatus[data[index].cropstatus.length - 1], {

                    status: "Passed",
                    date: tdate,
                  })

                  var upcus = this.afs.firestore.collection('customers').doc(String(this.porfid));


                  try {
                    firebase.firestore().runTransaction(transaction =>
                      transaction.get(upcus).then(async(totdoc) => {
      
      
                        var ss:any[]=totdoc.data().sdetails;
      
                        
                        ss[index].cacoon = Number(indata.cacoon)


                        Object.assign(ss[index].cropstatus[ss[index].cropstatus.length - 1], {
      
                          status: "Passed",
                          date: tdate,
                        })
                        transaction.update(upcus, { sdetails: ss })
      
                        const toast = await this.toast.create({
                          message: 'Status Updated and Add Cacoons',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
                          this.passstatus = false
    
                          console.log('done')
                        })
          
                      }))
                      .catch(async (err) => {
                        console.error(err)
                        this.logform.reset();
          
                        const toast = await this.toast.create({
                          message: 'Sorry could not Update and Add Cacoons...Try Again',
                          duration: 2000
                        });
                        toast.present().then(() => {
    
    
                        })
                      }
                      );
          
          
          
                  } catch (err) {
                    console.error(err)
                    const toast = await this.toast.create({
                      message: 'Sorry could not Update and Add Cacoons...Try Again',
                      duration: 2000
                    });
                    toast.present().then(() => {


                    })
          
                  }




                })


              }
            }
          ]
        });

        await alert.present();
        break;
      }






      default: {
        //statements; 
        break;
      }






    }










  }

  async failed(data: any, index: number) {

   var userq: any[] = []


    var d = new Date();
   var tdate = new Date(
      d.toDateString()
    ).toLocaleDateString("en-GB");

    userq['fullname'] = data[index].orderdetails.fullname;
    userq['phone'] = data[index].orderdetails.phone;
    userq['variety'] = data[index].orderdetails.variety;
    userq['stage'] = data[index].cropstatus[data[index].cropstatus.length - 1].stage
    userq['dfls'] = data[index].orderdetails.dflscount;
    userq['tdate'] = tdate;
    userq['odate'] = data[index].orderdetails.ooodate;
    userq['ddate'] = data[index].orderdetails.ddddate;
    userq['licno'] = data[index].orderdetails.licno;
    userq['created'] = firebase.firestore.Timestamp.fromDate(new Date());
    userq['adharno'] = data[index].orderdetails.adharno;
    userq['cname'] = data[index].orderdetails.cname;


    userq['resstatus'] = false










    const alert = await this.alertController.create({
      header: 'Update Confirm',
      message: 'Do You Want to <strong>Update</strong> the <strong>Status</strong> and send <strong>Query</strong>?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');


          }
        }, {
          text: 'Update and Send Query',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Updating Status and Sending Query,Please wait...',
              duration: 3000,
            });
            await loading.present().then(async () => {



  //            var join: string = String(this.porfid.concat(String('d'),String(d)))

              var join: string = this.afs.createId();


              userq['qid'] = join


           //   this.afs.collection('customers').doc(String(this.porfid)).update({ sdetails: data }).then(async () => {

            Object.assign(data[index].cropstatus[data[index].cropstatus.length - 1], {

              status: "Failed",
              date: tdate,
            })

            var upcus = this.afs.firestore.collection('customers').doc(String(this.porfid));


            try {
              firebase.firestore().runTransaction(transaction =>
                transaction.get(upcus).then(async(totdoc) => {


                  var ss:any[]=totdoc.data().sdetails;

                  
              Object.assign(ss[index].cropstatus[ss[index].cropstatus.length - 1], {

                status: "Failed",
                date: tdate,
              })

              transaction.update(upcus, { sdetails: ss })
               

                  this.afs.collection('userqueries').doc(join).set({ ...userq }).then(async () => {
                  }).then(async () => {
  
                    console.log('sent')
  
                    const lil = data[index].orderdetails.olicno;
                    this.afs
                      .collection("Ahomedetails")
                      .doc(lil)
                      .update({
                        userqueries: firebase.firestore.FieldValue.increment(1),
  
                      }).then(() => {
                        console.log('counted')
                      })
  
  
  
  
                    const toast = await this.toast.create({
                      message: 'Status Updated',
                      duration: 2000
                    });
                    toast.present().then(() => {
  
  
  
  
  
  
                      this.passstatus = false
  
                      console.log('done')
                    })
  
  
                  }).catch((e)=>{
                    console.log(e);
                    
                  })
    
                }))
                .catch(async (err) => {
                  console.error(err)
                  this.logform.reset();
    
                    const toast = await this.toast.create({
                      message: 'Could not Update...Try Again',
                      duration: 2000
                    });
                    toast.present().then(() => {
          
          
                    })
                }
                );
    
    
    
            } catch (err) {
              console.error(err)
              const toast = await this.toast.create({
                message: 'Could not Update...Try Again',
                duration: 2000
              });
              toast.present().then(() => {
    
    
              })
    
            }







 



              // }).catch((err)=>{
              //   console.log(err);
                
              // })
            })


          }
        }
      ]
    });

    await alert.present();


  }




  async cancelorder(id: string, li: string, bid: string, qunt: number,ggitem:any) {
    console.log(ggitem);
    
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do You Want to <strong>Cancel</strong> this <strong>Order</strong>?',
      buttons: [
        {
          text: "Don't Cancel",
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Cancel',
          handler: async () => {
            const toast = await this.toast.create({
              message: 'Canceling Order',
              duration: 2000
            });
            toast.present().then(async () => {



              var sendcc = this.afs.firestore.collection('batches').doc(String(bid));

              try {
                await firebase.firestore().runTransaction(transaction =>
                  transaction.get(sendcc).then(totdoc => {



                    transaction.update(sendcc, { cuscount: firebase.firestore.FieldValue.increment(-1), sizeused: firebase.firestore.FieldValue.increment(-Number(qunt)), });

                    var  dpayload = {
     
                      "title": "Order Canceled",
                      "body": "Your Order of "+ggitem.cname+" got Canceled as per as your Request",
                      "date": Date.now() ,
                            
                 
                
                }
                    this.afs.collection(String(ggitem.cat).toLowerCase().concat('s')).doc(String(ggitem.ordcoid)).update({
                      notifications: firebase.firestore.FieldValue.arrayUnion(dpayload)
                    
                    })

                    this.afs.collection('orders').doc(String(id)).delete().then(async () => {

                      this.afs.collection('Ahomedetails').doc(String(li)).update({
                        utotord: firebase.firestore.FieldValue.increment(-1),
                        uundelord: firebase.firestore.FieldValue.increment(-1),
                      })



                      const toast = await this.toast.create({
                        message: 'Order Canceled',
                        duration: 2000
                      });
                      toast.present()
                    })


                  }))
                  .catch(async (err) => {
                    console.error(err)
                    const toast = await this.toast.create({
                      message: 'Could Not Cancel Order',
                      duration: 2000
                    });
                    toast.present()
                  }
                  );


              } catch (err) {
                console.error(err)
                const toast = await this.toast.create({
                  message: 'Could Not Cancel Order',
                  duration: 2000
                });
                toast.present()



              }
























            })


          }
        }
      ]
    });

    await alert.present();
  }




  async addmarket(data: any, index: number) {
    let mmm = data[index]
    if (Number(this.logform.value.quant) > (Number(mmm.cacoon) - Number(mmm.cacoonsold))) {
      const toast = await this.toast.create({
        message: 'Entered qunatity is Greater than the Stock quantity',
        duration: 2000
      });
      toast.present()

    } else {



      var d = new Date();
      const tdate = new Date(
        d.toDateString()
      ).toLocaleDateString("en-GB");

      const loading = await this.loadingController.create({
        message: 'Adding Market,Please wait...',
        duration: 3000,
      });
      await loading.present().then(async () => {



        const rrdata: any[] = []
        rrdata['date'] = tdate
        rrdata['lotno'] = String(data[index].billingdetails.lotno);
        data[index].market.push({ ...this.logform.value, ...rrdata });

        mmm.cacoonsold = Number(mmm.cacoonsold) + Number(this.logform.value.quant)
        
        var upcus = this.afs.firestore.collection('customers').doc(String(this.porfid));

        try {
          firebase.firestore().runTransaction(transaction =>
            transaction.get(upcus).then(async(totdoc) => {

                  var ss:any[]=totdoc.data().sdetails;
                  ss[index].market.push({ ...this.logform.value, ...rrdata });
                  ss[index].cacoonsold = Number(ss[index].cacoonsold) + Number(this.logform.value.quant)
              transaction.update(upcus, { sdetails: ss })

              this.getmarinfo = false
              this.getmarinfo = false;
              this.passstatus = false
              console.log('done')
              this.logform.reset();
              const toast = await this.toast.create({
                message: 'Market Added',
                duration: 2000
              });
              toast.present().then(() => {
    
    
              })

            }))
            .catch(async (err) => {
              console.error(err)
              this.logform.reset();

                const toast = await this.toast.create({
                  message: 'Market did not got Added...Try Again',
                  duration: 2000
                });
                toast.present().then(() => {
      
      
                })
            }
            );



        } catch (err) {
          console.error(err)
          const toast = await this.toast.create({
            message: 'Market did not got Added...Try Again',
            duration: 2000
          });
          toast.present().then(() => {


          })

        }







      })

    }
  }






  async addcacoonextra(data: any, index: number) {
    var d = new Date();
    const tdate = new Date(
      d.toDateString()
    ).toLocaleDateString("en-GB");
    const alert = await this.alertController.create({
      header: 'Cacoon Details',
      //subHeader: '',
      message: 'Enter the Cacoon Qunatity',
      inputs: [

        {
          name: 'cacoon',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

            // Object.assign(data[index].cropstatus[data[index].cropstatus.length-1], {

            //   status:"Running",

            // })
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: async (indata) => {
            console.log('Confirm Ok');
            console.log(indata.cacoon);

            const loading = await this.loadingController.create({
              message: 'Adding Cacoons,Please wait...',
              duration: 3000,
            });
            await loading.present().then(async () => {


              if (data[index].cacoonsold < Number(indata.cacoon)) {

                data[index].cacoon = Number(indata.cacoon)




                this.afs.collection('customers').doc(String(this.porfid)).update({ sdetails: data }).then(async () => {
                  const toast = await this.toast.create({
                    message: 'Cacoons Added',
                    duration: 2000
                  });
                  toast.present().then(() => {

                    this.passstatus = false

                    console.log('done')
                  })
                }).catch(async (error) => {
                  const toast = await this.toast.create({
                    message: 'Sorry could not Add Cacoons...Try Again',
                    duration: 2000
                  });
                  toast.present().then(() => {


                  })
                })
              } else {
                const toast = await this.toast.create({
                  message: 'Enterd Cacoons are Less than the Cacoons Sold',
                  duration: 2000
                });
                toast.present().then(() => {


                })

              }
            })


          }
        }
      ]
    });

    await alert.present();
  }





  cbrealrate: number
  bvrealrate: number
  p1realrate: number

  purealrate: number
 

   rateit(showcont: any, ind: any) {
    console.log('hi');

    console.log(showcont);


    



    // var loading = await this.loadingController.create({
    //   message: 'Submiting your Rating...',
    //   duration: 3000,
    // });
    // await loading.present().then(async () => {


    // })



    var re = /\/|\.|\_/gi;
    var str = String(showcont[ind].billingdetails.licno);
    var newid = str.replace(re, "");



    var showconti = showcont[ind];
    var sendcc = this.afs.firestore.collection('Ahomedetails').doc(String(newid));

    var upcus = this.afs.firestore.collection('customers').doc(String(showconti.orderdetails.ordcoid));


    switch (showconti.variety) {



      case "Cross Breed(CB)": {

        console.log(showconti.variety);
        console.log(showconti.rating);
        try {
      firebase.firestore().runTransaction(transaction =>
            transaction.get(sendcc).then(totdoc => {

              const rate = totdoc.data();
     
              var cblolo: number = Number(rate.zcbrating) + Number( this.form.value.rating)
              if (rate.zcbrating===0) {

              this.cbrealrate = cblolo
              }else{
              this.cbrealrate = Number(Number( Number(cblolo) / 2).toFixed(0) )

              }
              console.log( this.form.value.rating)
              console.log(cblolo)



                transaction.update(sendcc, { zcbrating: Number(this.cbrealrate) })
                console.log('cb');


            }))
            .catch(async (err) => {
              console.error(err)
              const toast = await this.toast.create({
                message: 'Could Not Rate',
                duration: 2000
              });
              toast.present()
            }
            );


        } catch (err) {
          console.error(err)
        
        }


        break;



      }




      case "Bivoltine(BV)": {

        console.log(showconti.rating);
        try {
       firebase.firestore().runTransaction(transaction =>
            transaction.get(sendcc).then(totdoc => {

             var rate = totdoc.data();

              var bvlolo: number = Number(rate.zbvrating) + Number( this.form.value.rating)

             
              if (rate.zbvrating===0) {
                this.bvrealrate=bvlolo
              }else{
                this.bvrealrate =  Number(Number(  Number(bvlolo) / 2 ).toFixed(0) )

              }
                transaction.update(sendcc, { zbvrating: Number(this.bvrealrate) })

              

            }))
            .catch(async (err) => {
              console.error(err)
              const toast = await this.toast.create({
                message: 'Could Not Rate',
                duration: 2000
              });
              toast.present()
            }
            );
          

        } catch (err) {
          console.error(err)
         
        }



        break;

      }




      case "BV P1 Seed": {

       try {
        firebase.firestore().runTransaction(transaction =>
            transaction.get(sendcc).then(totdoc => {

              const rate = totdoc.data();

              var p1lolo: number = Number(rate.zp1rating) + Number( this.form.value.rating)

              if (rate.zp1rating===0) {
                this.p1realrate=p1lolo;
              }else{
                this.p1realrate =  Number(Number(  Number(p1lolo) / 2 ).toFixed(0) )

              }

            
     
                transaction.update(sendcc, { zp1rating: Number(this.p1realrate) })
              

            }))
            .catch(async (err) => {
              console.error(err)
              const toast = await this.toast.create({
                message: 'Could Not Rate',
                duration: 2000
              });
              toast.present()
            }
            );

        } catch (err) {
          console.error(err)
          
        }


        break;


      }



      case "Pure Mysore": {
        try {
        firebase.firestore().runTransaction(transaction =>
            transaction.get(sendcc).then(totdoc => {

              const rate = totdoc.data();

           
              var pulolo: number = Number(rate.zpurating) + Number( this.form.value.rating)

              if (rate.zpurating===0) {
                this.purealrate=pulolo
              }else{
                this.purealrate =  Number(Number(  Number(pulolo) / 2 ).toFixed(0) )

              }
                transaction.update(sendcc, { zpurating: Number(this.purealrate) })

              

            }))
            .catch(async (err) => {
              console.error(err)
              const toast = await this.toast.create({
                message: 'Could Not Rate',
                duration: 2000
              });
              toast.present()
            }
            );
          

        } catch (err) {
          console.error(err)
         
        }







      }




    }



    switch (showconti.variety) {

      case "Cross Breed(CB)": {
       
        try {
     firebase.firestore().runTransaction(transaction =>
            transaction.get(upcus).then(totdoc => {
   
   
              var clo=totdoc.data().sdetails
              Object.assign(clo[ind], {
            
                rating: this.form.value.rating
              })
            
  console.log(Number(String(this.cbrealrate).slice(0,1)),Number( Number(this.cbrealrate).toFixed(0)));
  
 
 transaction.update( upcus,{ sdetails:clo })


          
        }))
        .catch(async (err) => {
          console.error(err)
          const toast = await this.toast.create({
            message: 'Could Not Rate',
            duration: 2000
          });
          toast.present()
        }
        );

        

    } catch (err) {
      console.error(err)
    
    }
      
          break;
      }

      case "Bivoltine(BV)": {
       

     
        try {
         firebase.firestore().runTransaction(transaction =>
            transaction.get(upcus).then(totdoc => {
   
var blo=totdoc.data().sdetails
  Object.assign(blo[ind], {

    rating: this.form.value.rating
  })

  
 
 transaction.update( upcus,{ sdetails:blo })
console.log(blo);

console.log('hiii');

          
        }))
        .catch(async (err) => {
          console.error(err)
          const toast = await this.toast.create({
            message: 'Could Not Rate',
            duration: 2000
          });
          toast.present()
        }
        );

        

    } catch (err) {
    
    }
        break;

      }


      case "BV P1 Seed": {
      
        try {
         firebase.firestore().runTransaction(transaction =>
            transaction.get(upcus).then(totdoc => {
  

     
var bvlo=totdoc.data().sdetails
Object.assign(bvlo[ind], {

  rating: this.form.value.rating
})

  
 
 transaction.update( upcus,{ sdetails:bvlo })


          
        }))
        .catch(async (err) => {
          console.error(err)
          const toast = await this.toast.create({
            message: 'Could Not Rate',
            duration: 2000
          });
          toast.present()
        }
        );

       

    } catch (err) {
      console.error(err)
     
    }
        break;
      }


      case "Pure Mysore": {

       


        try {
        firebase.firestore().runTransaction(transaction =>
            transaction.get(upcus).then(totdoc => {
   
              var plo=totdoc.data().sdetails
              Object.assign(plo[ind], {
              
                rating: this.form.value.rating
              })
              

  
 
 transaction.update( upcus,{ sdetails:plo })


          
        }))
        .catch(async (err) => {
          console.error(err)
          const toast = await this.toast.create({
            message: 'Could Not Rate',
            duration: 2000
          });
          toast.present()
        }
        );

       
    } catch (err) {
      console.error(err)
   
    }


        break;

      }






    }





  }


}
