int ledler[]={4,5};
int led_sayisi=4;
int buton_pin=2;
int buton_deger=0;
int buton_basilma=0;

void setup() {
  Serial.begin(9600);
 for(int i=0;i<led_sayisi;i++)
 {
   pinMode(ledler[i],OUTPUT);
   }
  pinMode(buton_pin,INPUT);
}

void loop() {
  digitalWrite(2,HIGH);
  buton_deger=digitalRead(5);
   Serial.println(buton_deger);
  if(buton_deger==HIGH)
     {
      
      for(int i=0;i<led_sayisi;i++)
       {
       if(buton_basilma%led_sayisi==i)
         {
         digitalWrite(ledler[i],HIGH);
         }
         else
         {
         digitalWrite(ledler[i],LOW);
         }
        }
         buton_basilma++;
     delay(100);
       
       }
     else
     {
        for(int i=0;i<led_sayisi;i++)
       {
          digitalWrite(ledler[i],LOW);
         }
     
     }
   }

