import { Component, ViewChildren, QueryList } from '@angular/core';

import { Platform,IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from "@angular/fire/auth";

import { Router,  } from '@angular/router';

import { Storage } from '@ionic/storage';

import { ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DataService } from './data/data.service';


export interface uuser{
  introslides:boolean;
  adharno:number;
  phone:number
}
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = []
   

  
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  showmenu:boolean;
  ruserdetail:object

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afAuth: AngularFireAuth,
    public router: Router,
    private toast: ToastController,
    private storage:Storage,
    public alertController: AlertController,
    private menu: MenuController,
private d:DataService
  ) {

    console.log(this.d.catmenu)


    this.storage.get("userdetails").then(async(res) => {
       setTimeout(() => {

if(res==null){

  

if(this.d.catmenu=='customers'){

 this.appPages=[
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
   
   
    {
      title: 'My Orders',
      url: '/orders',
      icon: 'cart'
    },
    {
      title: 'Queries',
      url: '/list',
      icon: 'list'
    },
  ];

}else{
 this.appPages= [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
   
   
    {
      title: 'My Orders',
      url: '/orders',
      icon: 'cart'
    },
    
  ];

}




}


if(res!=null){
if(res.type=='customers'){
  
  this.appPages=[
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
   
   
    {
      title: 'My Orders',
      url: '/orders',
      icon: 'cart'
    },
    {
      title: 'Queries',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Info',
      url: '/info',
      icon: 'information-circle-sharp'
    },
  ];

}else{
 this.appPages= [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
   
   
    {
      title: 'My Orders',
      url: '/orders',
      icon: 'cart'
    },
    {
      title: 'Info',
      url: '/info',
      icon: 'information-circle-sharp'
    },
    
  ];

}

       
 

}
      },1000)})








    this.afAuth.auth
    .signInWithEmailAndPassword("ruhmtest@gmail.com", "ruhm@1")
    .then(user => {
      this.initializeApp();

console.log(user);
  
  })
console.log(this.d.select);

  
  this.platform.backButton.subscribe(async () => {
  // if (this.router.isActive('/home',true) ){
     // if (this.router.url === '/home') { 
   if (this.router.isActive('/login',true)||this.router.isActive('/home',true) ){
     
     navigator['app'].exitApp();
   }
   if (this.router.isActive('/orders',true)
  // ||this.router.isActive('/home',true)
   )
   {
    this.router.navigate(['/home']); 
   
  }
   })
 



 
 }







  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


logdetail:any;

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
