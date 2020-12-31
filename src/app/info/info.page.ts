import { Component, OnInit, } from '@angular/core';
import { Platform, } from '@ionic/angular';

import { Router, Navigation } from '@angular/router';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

pest:boolean=false;
diseases:boolean=false;
showindex:boolean=true;
showstage:boolean=false;
soil:boolean=false;
cultivation:boolean=false;


details:any[]=[]

detailstwo:any[]=[]

  constructor(private callNumber: CallNumber,
   private fcm:FCM,private storage: Storage,
   private lno:LocalNotifications  , private platform: Platform,private router: Router,) {


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
      console.log("Received in foreground");

         this.storage.get("noti").then((nnres) => {
          var noti={
          notinum: nnres.notinum+1
        }
      this.storage.set("noti", noti)
      })
      
          this.lno.schedule([{
            text: data.subtitle,
          title:data.title,
      
          }]);
      
        };
      });
      


    this.platform.backButton.subscribe((res)=>{
      this.router.navigate(['/home']);
    
      })



this.details=[{
 image:"../../assets/infos/thirps.png",
    title:"THIRPS",
   deta:{
l1:"PERIOD OF INFESTATION :- FEB – JUNE",
l2:"PEAK SEASON :- MARCH – APRIL",
l3:"ECONOMIC THRESHOLD LEVEL (ETL) :- 20 THRIPS/LEAF.",
l4:"YIELD LOSS :- 25%"

   },
nature:{
title:"Nature of damage and symptoms",
l1:"YELLOW STREAKS IN EARLY STAGES",
l2:"MATURE LEAVES BECOME YELLOWISH BROWN, APPEARS LEATHARY AND BECOMES BOAT SHAPED.",
l3:"REVERSE CURLING OF THE LEAVES ARE ALSO NOTED."


},
mechanical:{
  title:"Mechanical / Physical Control",
 l1:" SPRINKLER IRRIGATION.",
l2:"REMOVE WEEDS , PLANTS SORROUNDING MULBERRY GARDEN",
l3:"DEEP DIGGING FOLLOWED BY FLOOD IRRIGATION"

}
},
{
  image:"../../assets/infos/mealybug.png",

  title:"MEALY BUG",
  deta:{
  l1:"PERIOD OF INFESTATION :- MARCH – AUGUST",
  l2:"PEAK SEASON :- JUNE – JULY",
  l3:"ECONOMIC THRESHOLD LEVEL (ETL) :- 10MEALY BUG/SHOOT.",
  l4:"YIELD LOSS :- 25%",
},
nature:{
           title:"Nature of damage and symptoms",
l1:"THICKENING AND TWISTING OF THE APICAL PORTION OF THE AFFECTED SHOOT, SHORTENING OF THE INTER NODAL DISTANCE WITH BUSHY TOP, SYMPTOMS ARE CALLED 'TUKRA'.", 
},            
mechanical:{
title:"Mechanical / Physical Control",
 l1:" REMOVE THE AFFECTED SHOOT FOLLOWED BY BURNING.",
  l2:"REMOVE ALTERNATE HOST PLANTS AROUND MULBERRY GARDEN.",
}



},

{
 image:"../../assets/infos/whitefly1.png",

 image1:"../../assets/infos/whitefly1.png",
 image2:"../../assets/infos/whitefly2.png",

  title:"WHITE FLY",
 deta:{
l1:"PERIOD OF INFESTATION :- THROUGHT THE YEAR",
l2:"PEAK SEASON :- AUGUST – NOVEMBER", 
l3:"ECONOMIC THRESHOLD LEVEL (ETL) :- 20 NO./LEAF.",
l4:"YIELD LOSS :- 25%"
},
nature:{
               title:"Nature of damage and symptoms",
l1:"WHITEFLY SUCKS THE JUICE FROM TENDER LEAVES RESULTING IN CHLOROSIS AND LEAF CURL.",
l2:"THE NYMPHAL STAGES OFWHITEFLY, TAKES OUT CELL SAP AND EXCRETE HONEYDEW WHICH ACTS AS A MEDIUM FOR THE GROWTH OF SOOTY MOULD FUNGUS.",
l3:"THE SOOTY MOULD FUNGUS FORMS A BLACK COATING ON THE UPPER SURFACE OF MULBERRY LEAVES ",
 l4:"THE BLACK COATING AFFECTS THE PHOTOSYNTHESIS AND RESULTS IN LOW NUTRITIVE VALUE, RENDERS IT UNFIT FOR SILKWORM REARING.",

},
mechanical:{
                  title:"Mechanical / Physical Control",
l1:"REMOVE WEEDS AND OTHER PLANT HOSTS.",
l2:"AFFECTED LEAVES SHOULD BE BURNT.",
l3:"INSTALL YELLOW STICKY TRAPS AFTER 15 DAYS OF PRUNING DURING JUNE – NOVEMBER." 
}
},
{
  image:"../../assets/infos/rootmealybug.png",

  title:"ROOT MEALY BUG",
  deta:{
l1:"PERIOD OF INFESTATION :- THROUGHT THE YEAR",
  l2:"PEAK SEASON :- JULY – SEPT",
  l3:"ECONOMIC THRESHOLD LEVEL (ETL) :- 10 MEALY BUG/PLANT.",
  l4:"YIELD LOSS :- 20%",
  },
  nature:{      
 title:" Nature of damage and symptoms",
l1:"NORMAL GROWTH OF PLANT CEASES, LOSS VIGOUR.",
  l2:"LEAVES BECOME YELLOWISH, APPEARED TO BE WILTING.",
  l3:"FUNGUS GROW AT THE SITE OF INFESTATION AND ROOT ROT APPEARS.",
  l4:"PLANT DIE AFTER SEVERE ATTACK.",
}
               
  
},


]

this.detailstwo=[{
 image:"../../assets/infos/powdermildew.png",

 title:"POWDERY MILDEW",
 l1:"CASUAL ORGANISM :- PHYLLACTINIA",
season:{
title:"SEASON",
l1:"NOVEMBER TO DECEMBER AND FEBRUARY"
},
symptoms:{
 title:"SYMPTOMS",
l1:"APPEARANCE OF WHITE COLOURED POWDERY MASS ON THE LOWER SURFACE OF THE LEAVES.",
l2:"LEAVES BECOME YELLOWISH.",
l3:"PREMATURE DEFOLIATION.",
}
},
{
 image:"../../assets/infos/brownleafspot.png",

title:"BROWN LEAF SPOT",
 l1:" CASUAL ORGANISM :- MYROTHECIUM RORIDUM",

season:{
title:"SEASON",
l1:"MAY TO JANUARY"
},
symptoms:{
     title:" SYMPTOMS",
l1:"APPEARANCE OF BROWN SPOTS IN THE LEAVES.",
l2:"SPOTS COALESCE TO FORM BIGGER ONES.",
l3:"FORMATION OF HOTELS ON THE LEAVES.",
}
},
{
 image:"../../assets/infos/blackleafspot.png",

  title:"BLACK LEAF SPOT",
  l1:"CASUAL ORGANISM :- PSEUDOCERCOSPORA MORI",

season:{
 title:" SEASON",
  l1:"MAY TO SEPTEMBER AND FEBRUARY",
},
symptoms:{

  title:"SYMPTOMS",
  l1:"APPEARANCE OF VELVETY BLACK IRREGULAR SPOTS ON THE VENTRAL SURFACE OF LEAVES.",
  l2:"SPOTS COALESE TO FORM BIGGER ONES.",
  l3:"PREMATURE DEFOILATION"
}  
},{
 image:"../../assets/infos/brownleafrust.png",

  title:"BROWN LEAF RUST",
  l1:"CASUAL ORGANISM :- PERIDIOSPORA MORI",

season:{
title:"SEASON",
l1:"JANUARY TO FEBRUARY"
},
symptoms:{
 title:"SYMPTOMS",
l1:"APPEARANCE OF SMALL PIN HEAD SHAPED BROWN TO BLACK RUSTY SPOTS ON THE VENTRAL SURFACE OF LEAF.",
l2:"SEVERELY INFECTED LEAVES TURN YELLOWISH AND MARGINS BECOME DRY.",
}
},
{
 image:"../../assets/infos/bacterialleafspot.png",

  title:"BACTERIAL LEAF SPOT",
  l1:"CASUAL ORGANISM :- XANTHOMONAS CAMPESTRIS PV. MORI",

season:{
title:"SEASON",
l1:"MAY TO NOVEMBER",
},
symptoms:{

 title:"SYMPTOMS",
l1:"APPEARANCE OF NUMEROUS WATER SOAKED SPOTS ON THE LOWER SURFACE OF THE LEAVES.",
l2:"SPOTS TURN BROWNISH SORROUNDED BY YELLOW MARGIN.",
}
}

]

   }

  ngOnInit() {
  }



  callme(){
    this.callNumber.callNumber("+919008335541", true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
  }

}
