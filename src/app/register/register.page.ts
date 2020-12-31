import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Router, Navigation } from '@angular/router';

import { FormBuilder, FormGroup, Validators, FormArray, } from "@angular/forms";
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


import { HttpClient } from "@angular/common/http";

import * as firebase from "firebase/app";
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';



export class District {
  value: string;
}


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  selection: string = '';
  gettype: boolean = true;

  showlogbut: boolean = true;

  cusregform: FormGroup;
  supregform: FormGroup;
  selectstatesform: FormGroup;

  realshow: string;

  tireme: boolean = true




  next: boolean = true;

  districts: District[] = []
  towns: District[] = []
  states: District[] = []


  showback: boolean = true;


  private crccollection: AngularFirestoreCollection<any>;
  crcs: Observable<any[]>;




  cccat: District[] = [
    { value: "Primary" },
    { value: "Secondary" }



  ];

  private checkcollection: AngularFirestoreCollection<any>;
  check: Observable<any[]>;

  showregload: boolean = false;
  showregafter: boolean = false


  homen: boolean

  loadcontent: string
  constructor(private platform: Platform, private router: Router, private afs: AngularFirestore, private fb: FormBuilder, private storage: Storage, public d: DataService
    , private toast: ToastController, private loc: Location, private fcm: FCM, private http: HttpClient,private lno: LocalNotifications) {

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
      












    console.log(this.tireme);



    this.storage.get("userdetails").then((res) => {

      


        if (res == null) {

        
            this.next = true;
            this.homen = true;
            this.gettype = true;
          

        } else if (res != null) {
          this.showback=false;
          if (res.type != null || res.adharno != null) {
            this.showback=false;

            this.homen = false;
          this.gettype = false;
            this.next = true;

            // this.selection = 'Supervisor';
            // this.gettype = false;
            var first = String(res.type[0]).toUpperCase();

            this.selection = first.concat(String(res.type).substring(1, String(res.type).length - 1).toLowerCase())
            console.log(this.selection);

          } else {

            this.next = true;
            this.homen = true;
            this.gettype = true;
          }
        }
  

    })





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




  }

  ngOnInit() {



    this.cusregform = this.fb.group({
      fullname: [String(""), [Validators.required]],
      phone: [String(""), [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      adharno: [String(""), [Validators.required, , Validators.maxLength(12), Validators.minLength(12)]],
      address: [String(""), [Validators.required,]],
      state: [String(""), [Validators.required,]],
      pincode: [String(""), [Validators.required,Validators.maxLength(6), Validators.minLength(6)]],

      district: [String(""), [Validators.required,]],
      town: [String(""), [Validators.required,]],
      land: [String(""), [Validators.required,]],
      culttype: [String(""), [Validators.required,]],
      village: [String(""), [Validators.required,]],


      push: [Boolean("")]
    });



    this.supregform = this.fb.group({
      fullname: [String(""), [Validators.required]],
      phone: [String(""), [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      adharno: [String(""), [Validators.required, Validators.maxLength(12), Validators.minLength(12)]],
      address: [String(""), [Validators.required,]],
      state: [String(""), [Validators.required,]],
      pincode: [String(""), [Validators.required,Validators.maxLength(4), Validators.minLength(4)]],
      district: [String(""), [Validators.required,]],
      town: [String(""), [Validators.required,]],

      village: [String(""), [Validators.required,]],


      push: [Boolean("")]
    });

    this.selectstatesform = this.fb.group({

      selstates: [String(""), [Validators.required,]],
    })


  }



  second() {
    this.mbatches = []
    this.showregload = false
    this.next = true
    console.log('second');
    
  }



  supsel() {
    this.selection = 'Supervisor';
    this.gettype = false;
  }

  cussel() {
    this.selection = 'Customer';
    this.gettype = false;

  }



  third(){
    console.log('third');
    
  }

  show() {

    console.log(this.cusregform.value);

  }

  showselstates() {
    console.log(this.selectstatesform.value);

  }






  checkit: number = 0
  mbatches: any[] = [];


  showcrcs: boolean = false;

  searchcrc() {
    this.mbatches = []
    
    this.next = false;
    this.showselstates();
    this.showregload = true

    const seeellected: string[] = this.selectstatesform.value.selstates

    if (seeellected.length >= 1) {

      seeellected.forEach((ksdata, llindex) => {

        console.log(ksdata)
        this.crccollection = this.afs.collection<any>("Ahomedetails", ref =>
          ref.where("astate", "==", String(ksdata).trim())
        );
        this.crcs = this.crccollection.snapshotChanges().pipe(

          map(actions =>
            actions.map(a => {

              console.log(a.payload.doc.data() as any);

              const bdata = a.payload.doc.data() as any

              const id = a.payload.doc.id;

              return { id, ...bdata };

            })
          )

        );
        this.crcs.subscribe((res) => {


          console.log(res)
          var arrdata: any[] = res


          // this.mbatches.push(arrdata);
          this.checkit = this.checkit + 1
          if (res != null && this.checkit < seeellected.length + 1) {

            //      if(this.d.data.length!=0){
            //        this.d.data.forEach((dd,din)=>{

            //         arrdata.forEach((ad,ain)=>{
            //             if(String(ad.alicno)==String(dd.licno)){
            //              this.mbatches.splice(ain,1)

            //             }
            //         })  


            //        })
            //      }else{
            // this.mbatches.push(arrdata);

            //      }



            if (this.homen) {

              this.mbatches.push(arrdata);
            } else {

              if (this.d.data != null || this.d.data != undefined || this.d.data.length != 0) {


                if (arrdata.length != 0) {
                  this.d.data.forEach((dim, dimin) => {
                    arrdata.forEach((gg, gin) => {
                      if (String(gg.alicno) == String(dim.licno)) {


                        arrdata.splice(gin, 1)
                      }


                    })
                    if (dimin == this.d.data.length - 1) {


                      this.mbatches.push(arrdata);
                    }
                  })
                }

              }


            }








            //  this.mbatches.push(arrdata);


          }

          // this.mbatches.forEach((mdata,mindex)=>{
          // if(mdata[0].alicno===res[0].alicno){
          //  //this.mbatches.push(res);
          //  this.mbatches.splice(mindex,1,res)


          // }
          // })




          this.mbatches.forEach((mdata, mindex) => {
            if (mdata[0].alicno === res[0].alicno) {


              mdata.forEach((mmdata, mmindex) => {

                Object.assign(this.mbatches[mindex][mmindex], {




                  zbvrating: res[mmindex].zbvrating,

                  zcbrating: res[mmindex].zcbrating,

                  zp1rating: res[mmindex].zp1rating,

                  zpurating: res[mmindex].zpurating,

                  zrcountbv: res[mmindex].zrcountbv,

                  zrcountcb: res[mmindex].zrcountcb,

                  zrcountp1: res[mmindex].zrcountp1,

                  zrcountpu: res[mmindex].zrcountpu,

                  ztbvtot: res[mmindex].ztbvtot,

                  ztcbtot: res[mmindex].ztcbtot,


                  ztp1tot: res[mmindex].ztp1tot,

                  ztputot: res[mmindex].ztputot,






                })


              })



              //this.mbatches.push(res);
              //  this.mbatches.splice(mindex,1,res)


            }
          })




        })


        if (llindex == seeellected.length - 1) {
          console.log(this.mbatches);
          // this.showcontd=true;
          // this.showconto=true; 
          this.checkit = 0
          this.showcrcs = true;

        


        }

      })




    } else {

    }

  }






  iddata: any[] = [];
  custable: boolean = false;
  ncus: number = 0;
  onChange(event, checkdata: any) {
    console.log(event);


    if (event.detail.checked) {
      this.iddata.push(checkdata);

    } else {
      const i = this.iddata.findIndex(x => x == checkdata);
      this.iddata.splice(i, 1);
    }

    console.log(this.iddata);
    this.ncus = this.iddata.length;
  }



  ad: number

  checklen: number

  ruserdetails: any
  async makeregister() {

this.showregload=false;

    if (this.iddata.length >= 1) {
      this.iddata.forEach((licdata, licindex) => {


        console.log(licdata)

        
        this.loadcontent = 'Registration Started'

        this.showregafter = true;

        const selel: string = this.selection.toLowerCase().concat('s');

        if (selel == 'customers') {
          this.ad = Number(this.cusregform.value.adharno)
        }

        if (selel == 'supervisors') {
          this.ad = Number(this.supregform.value.adharno)
        }
        this.checkcollection = this.afs.collection<any>(selel, ref =>
          ref.where("adharno", "==", Number(this.ad)).where("licno", "==", String(licdata.licno))
        );
        this.check = this.checkcollection.snapshotChanges().pipe(

          map(actions =>
            actions.map(a => {

              console.log(a.payload.doc.data() as any);

              const bdata = a.payload.doc.data() as any

              const id = a.payload.doc.id;

              return { id, ...bdata };

            })
          )

        );
        this.check.subscribe((res) => {
          this.checklen = res.length

        })



        setTimeout(async () => {
          if (this.checklen == null) {
            setTimeout(async () => {


              if (this.checklen == 0) {

                if (selel == 'customers') {


                  const increment = firebase.firestore.FieldValue.increment(1);
                  const cid = this.afs.createId();
                  const li = String(licdata.alicno);

                  var senddata = this.afs.firestore.collection(selel).doc(cid);

                  try {
                    const data: any[] = [];


                    data["sdetails"] = [];
                    data["id"] = cid;
                    data['licno'] = li
                    data['created'] = firebase.firestore.Timestamp.fromDate(new Date());
                    const state: string = this.cusregform.value.state.toString()
                    const adh: string = String(licdata.aadharno);
                    const dis: string = this.cusregform.value.district.toString();
                    const tow: string = this.cusregform.value.town.toString();

                    data['date'] = new Date();

                    data['cat'] = "CUSTOMER"
                    //console.log( "RI".concat(state.slice(0,3).toUpperCase(),"FFR",adh.slice(8,12),dis.slice(0,4).toUpperCase(),tow.slice(0,4).toUpperCase(),"C",cusunique))

                    const Ahome = this.afs.firestore.collection("Ahomedetails").doc(String(licdata.aolicno));

                    await firebase.firestore().runTransaction(transaction =>
                      transaction.get(Ahome).then(Ahomedoc => {
                        const cusno = Ahomedoc.data().ycuscount + 1

                        const cusunique: string = String(cusno);
                        data['myuser'] = Ahomedoc.data().myuser;


                        data['uid'] = "RI".concat(state.slice(0, 3).toUpperCase(), "SFR", adh.slice(8, 12), dis.slice(0, 4).toUpperCase(), tow.slice(0, 4).toUpperCase(), "C", cusunique)

                        transaction.update(Ahome, { ycuscount: increment })

                      //  data['token'] = 'await token;'


                        this.fcm.getToken().then(async (token) => {
                        data['token'] =await token;


                        })


                        Object.assign(this.cusregform.value, {

                          adharno: Number(this.cusregform.value.adharno)

                        })




                        senddata
                          .set({ ...this.cusregform.value, ...data })

                          .then(async () => {



                            const toast = await this.toast.create({
                              message: 'Registerd With' + licdata.acname,
                              duration: 5000
                            });
                            toast.present().then(() => {

                              if (licindex == this.iddata.length - 1) {


                                const selel: string = this.selection.toLowerCase().concat('s');

                                this.loadcontent = "Succesfully Registered"

                            
                                  this.ruserdetails = {
                                    type: selel,
                                    adharno: Number(this.cusregform.value.adharno),
                                    phone: Number(this.cusregform.value.phone),
                                    push: false
                                  }
                                
                                this.storage.set("userdetails", this.ruserdetails).then(() => {

                                  var noti={
                                    notinum:0
                                  }
                                  this.storage.set("noti", noti)

                                  this.loadcontent="Logging in..."
                                  setTimeout(() => {
                                    
                                    this.router.navigate(['/login']).then(()=>{
                                      this.mbatches = [];
                                      this.cusregform.reset();
                                      this.supregform.reset();
                                      this.showcrcs = false
                                     
                                     
                                      this.loadcontent = ''
                                      this.next = true
                                      this.gettype = true;
                                      window.location.reload();
                                      
                                    })
                                    
                                  },3000);
                                })
                              }



                            })

})
                          .catch(err => {
                            console.error(err);
                            console.log(err);
                          });

                      })).catch((err) => {

                        console.error(err)



                      });






                  } catch (err) {
                    console.error(err);
                    console.log(err);
                  }
                  // this.afs.collection(selel).doc(pid).set({})

                }

                if (selel == 'supervisors') {
  const increment = firebase.firestore.FieldValue.increment(1);
                  const cid = this.afs.createId();
                  const li = String(licdata.alicno);

                  var senddata = this.afs.firestore.collection(selel).doc(cid);

                  try {
                    const data: any[] = [];


                    data["sdetails"] = [];
                    data["id"] = cid;
                    data['licno'] = li
                    data['created'] = firebase.firestore.Timestamp.fromDate(new Date());
                    const state: string = this.cusregform.value.state.toString()
                    const adh: string = String(licdata.aadharno);
                    const dis: string = this.cusregform.value.district.toString();
                    const tow: string = this.cusregform.value.town.toString();

                    data['date'] = new Date();

                    data['cat'] = "SUPERVISOR"
                    //console.log( "RI".concat(state.slice(0,3).toUpperCase(),"FFR",adh.slice(8,12),dis.slice(0,4).toUpperCase(),tow.slice(0,4).toUpperCase(),"C",cusunique))

                    const Ahome = this.afs.firestore.collection("Ahomedetails").doc(String(licdata.aolicno));

                    await firebase.firestore().runTransaction(transaction =>
                      transaction.get(Ahome).then(Ahomedoc => {
                        const supno = Ahomedoc.data().ysupcount + 1

                        const cusunique: string = String(supno);
                        data['myuser'] = Ahomedoc.data().myuser;


                        data['uid'] = "RI".concat(state.slice(0, 3).toUpperCase(), "SUP", adh.slice(8, 12), dis.slice(0, 4).toUpperCase(), tow.slice(0, 4).toUpperCase(), "S", cusunique)

                        transaction.update(Ahome, { ysupcount: increment })

                     //   data['token'] = 'await token;'


                        this.fcm.getToken().then(async (token) => {
                          data['token'] =await token;


                        })

                        Object.assign(this.supregform.value, {

                          adharno: Number(this.supregform.value.adharno)

                        })

                        senddata
                          .set({ ...this.supregform.value, ...data })

                          .then(async () => {


                            const toast = await this.toast.create({
                              message: 'Registerd With ' + licdata.acname,
                              duration: 5000
                            });
                            toast.present().then(() => {

                              if (licindex == this.iddata.length - 1) {


                                const selel: string = this.selection.toLowerCase().concat('s');

                                this.loadcontent = "Succesfully Registered"

                               
                                  this.ruserdetails = {
                                    type: selel,
                                    adharno: Number(this.cusregform.value.adharno),
                                    phone: Number(this.cusregform.value.phone),
                                    push: false
                                  }
                                
                                

                                this.storage.set("userdetails", this.ruserdetails).then(() => {
                                  var noti={
                                    notinum:0
                                  }
                                  this.storage.set("noti", noti)
                                  
                                  this.loadcontent="Logging in..."
                                  setTimeout(() => {
                                    
                                    this.router.navigate(['/login']).then(()=>{
                                      this.mbatches = [];
                                      this.cusregform.reset();
                                      this.supregform.reset();
                                      this.showcrcs = false
                                     
                                     
                                      this.loadcontent = ''
                                      this.next = true
                                      this.gettype = true;
                                      window.location.reload();
                                      
                                    })
                                    
                                  },3000);
                                })
                              }



                            })



                          })
                          .catch(err => {
                            console.error(err);
                            console.log(err);
                          });

                      })).catch((err) => {

                        console.error(err)



                      });

                  } catch (err) {
                    console.error(err);
                    console.log(err);
                  }


                }




              } else {
                this.loadcontent = "Already Registered with " +licdata.acname

              }







            }, 5000)

          } else {


            if (this.checklen == 0) {

              if (selel == 'customers') {



                this.loadcontent = 'Registring With' + licdata.acname

                const increment = firebase.firestore.FieldValue.increment(1);
                const cid = this.afs.createId();
                const li = String(licdata.alicno);

                var senddata = this.afs.firestore.collection(selel).doc(cid);

                try {
                  const data: any[] = [];


                  data["sdetails"] = [];
                  data["id"] = cid;
                  data['licno'] = li
                  data['created'] = firebase.firestore.Timestamp.fromDate(new Date());
                  const state: string = this.cusregform.value.state.toString()
                  const adh: string = String(licdata.aadharno);
                  const dis: string = this.cusregform.value.district.toString();
                  const tow: string = this.cusregform.value.town.toString();

                  data['date'] = new Date();

                  data['cat'] = "CUSTOMER"
                  //console.log( "RI".concat(state.slice(0,3).toUpperCase(),"FFR",adh.slice(8,12),dis.slice(0,4).toUpperCase(),tow.slice(0,4).toUpperCase(),"C",cusunique))

                  const Ahome = this.afs.firestore.collection("Ahomedetails").doc(String(licdata.aolicno));

                  await firebase.firestore().runTransaction(transaction =>
                    transaction.get(Ahome).then(Ahomedoc => {
                      const cusno = Ahomedoc.data().ycuscount + 1

                      const cusunique: string = String(cusno);
                      data['myuser'] = Ahomedoc.data().myuser;


                      data['uid'] = "RI".concat(state.slice(0, 3).toUpperCase(), "SFR", adh.slice(8, 12), dis.slice(0, 4).toUpperCase(), tow.slice(0, 4).toUpperCase(), "C", cusunique)

                      transaction.update(Ahome, { ycuscount: increment })

                      data['token'] = 'await token;'


                      // this.fcm.getToken().then(async (token) => {
                      //   //data['token'] =await token;


                      // })

                      Object.assign(this.cusregform.value, {

                        adharno: Number(this.cusregform.value.adharno)

                      })

                      senddata
                        .set({ ...this.cusregform.value, ...data })

                        .then(async () => {


                          const toast = await this.toast.create({
                            message: 'Registerd With' + licdata.acname,
                            duration: 5000
                          });
                          toast.present().then(() => {

                            if (licindex == this.iddata.length - 1) {


                              const selel: string = this.selection.toLowerCase().concat('s');

                              this.loadcontent = "Succesfully Registered"

                                this.ruserdetails = {
                                  type: selel,
                                  adharno: Number(this.cusregform.value.adharno),
                                  phone: Number(this.cusregform.value.phone),
                                  push: false
                                }
                             
                              this.storage.set("userdetails", this.ruserdetails).then(() => {
                                var noti={
                                  notinum:0
                                }
                                this.storage.set("noti", noti)
                               


                                this.loadcontent="Logging in..."
                                setTimeout(() => {
                                    
                                  this.router.navigate(['/login']).then(()=>{
                                    this.mbatches = [];
                                    this.cusregform.reset();
                                    this.supregform.reset();
                                    this.showcrcs = false
                                   
                                   
                                    this.loadcontent = ''
                                    this.next = true
                                    this.gettype = true;
                                    window.location.reload();
                                    
                                  })
                                  
                                },3000);
                              })
                            }



                          })

                        })
                        .catch(err => {
                          console.error(err);
                          console.log(err);
                        });

                    })).catch((err) => {

                      console.error(err)



                    });

                } catch (err) {
                  console.error(err);
                  console.log(err);
                }

                // this.afs.collection(selel).doc(pid).set({})

              }

              if (selel == 'supervisors') {




                const increment = firebase.firestore.FieldValue.increment(1);
                const cid = this.afs.createId();
                const li = String(licdata.alicno);

                var senddata = this.afs.firestore.collection(selel).doc(cid);

                try {
                  const data: any[] = [];


                  data["sdetails"] = [];
                  data["id"] = cid;
                  data['licno'] = li
                  data['created'] = firebase.firestore.Timestamp.fromDate(new Date());
                  const state: string = this.cusregform.value.state.toString()
                  const adh: string = licdata.aadharno.toString();
                  const dis: string = this.cusregform.value.district.toString();
                  const tow: string = this.cusregform.value.town.toString();

                  data['date'] = new Date();

                  data['cat'] = "SUPERVISOR"
                  //console.log( "RI".concat(state.slice(0,3).toUpperCase(),"FFR",adh.slice(8,12),dis.slice(0,4).toUpperCase(),tow.slice(0,4).toUpperCase(),"C",cusunique))

                  const Ahome = this.afs.firestore.collection("Ahomedetails").doc(String(licdata.aolicno));

                  await firebase.firestore().runTransaction(transaction =>
                    transaction.get(Ahome).then(Ahomedoc => {
                      const supno = Ahomedoc.data().ysupcount + 1

                      const cusunique: string = String(supno);
                      data['myuser'] = Ahomedoc.data().myuser;


                      data['uid'] = "RI".concat(state.slice(0, 3).toUpperCase(), "SUP", adh.slice(8, 12), dis.slice(0, 4).toUpperCase(), tow.slice(0, 4).toUpperCase(), "S", cusunique)

                      transaction.update(Ahome, { ysupcount: increment })

                      data['token'] = ''


                      // this.fcm.getToken().then(async (token) => {
                      //   //data['token'] =await token;


                      // })

                      Object.assign(this.supregform.value, {

                        adharno: Number(this.supregform.value.adharno)

                      })

                      senddata
                        .set({ ...this.supregform.value, ...data })

                        .then(async () => {
                          const toast = await this.toast.create({
                            message: 'Registerd With' + licdata.acname,
                            duration: 5000
                          });
                          toast.present().then(() => {


                            if (licindex == this.iddata.length - 1) {


                              const selel: string = this.selection.toLowerCase().concat('s');

                              this.loadcontent = "Succesfully Registered"

                             
                                this.ruserdetails = {
                                  type: selel,
                                  adharno: Number(this.cusregform.value.adharno),
                                  phone: Number(this.cusregform.value.phone),
                                  push: false
                                }
                             

                              this.storage.set("userdetails", this.ruserdetails).then(() => {
                                var noti={
                                  notinum:0
                                }
                                this.storage.set("noti", noti)

                                this.loadcontent="Logging in..."
                                setTimeout(() => {
                                    
                                  this.router.navigate(['/login']).then(()=>{
                                    this.mbatches = [];
                                    this.cusregform.reset();
                                    this.supregform.reset();
                                    this.showcrcs = false
                                   
                                   
                                    this.loadcontent = ''
                                    this.next = true
                                    this.gettype = true;
                                    window.location.reload();
                                    
                                  })
                                  
                                },3000);
                              })
                            }








                          })


                        })
                        .catch(err => {
                          console.error(err);
                          console.log(err);
                        });

                    })).catch((err) => {

                      console.error(err)



                    });

                } catch (err) {
                  console.error(err);
                  console.log(err);
                }

              }




            } else {

            }


          }

        }, 5000);


 if(this.iddata.length==licindex){
  this.showregafter = false;
 }

      })

    }










  }


  gotologin() {
    this.router.navigate(['/']);
  }

  gotohome() {
    this.router.navigate(['/home']);
  }


}
