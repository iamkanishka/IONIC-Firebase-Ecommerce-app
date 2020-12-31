import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data/data.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

allnot:any[]=[];

showcont:boolean=false


  constructor(  private router: Router,
    private storage: Storage,
    private fcm:FCM, private lno:LocalNotifications ,
    public d: DataService,
    
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
      




















     setTimeout(() => {
       

this.d.data.forEach((ee,eindex)=>{
 ee.notifications.forEach((nn,nindex)=>{
  this.allnot.push(nn)

if(eindex==this.d.data.length-1&&nindex==ee.notifications.length-1){

  this.allnot.sort((a, b)=> {
    var dateA = a.date, dateB =b.date;
    return dateB - dateA;
  })

  this.showcont=true
}

 })

})

}, 5000); 


console.log(this.allnot);


    }

  ngOnInit() {
  }


  gotohome(){
    this.router.navigate(['/home']);
  }






}
