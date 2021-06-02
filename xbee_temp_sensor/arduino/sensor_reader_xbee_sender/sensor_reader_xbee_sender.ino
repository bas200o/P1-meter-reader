
// lib download https://www.circuitbasics.com/wp-content/uploads/2015/10/DHTLib.zip
#include "dht.h"

dht DHT;

#define DHT11_PIN 7

void setup(){
  Serial.begin(9600);
}

void loop(){
  int chk = DHT.read11(DHT11_PIN);
  double temp = DHT.temperature;
  double humidity = DHT.humidity;
  
  if(humidity > -1){

  Serial.print("\{\"temperature\"\:");
  Serial.print(temp);
  Serial.print(",\"humidity\"\:");
  Serial.print(humidity);
  Serial.println("\}");    
    delay(5000);
  }else{
    delay(2000);
  }
}
