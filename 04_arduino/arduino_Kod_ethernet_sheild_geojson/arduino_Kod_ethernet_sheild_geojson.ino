#include <Dhcp.h>
#include <Dns.h>
#include <Ethernet.h>
#include <EthernetClient.h>
#include <EthernetServer.h>
#include <EthernetUdp.h>
#include <SPI.h>

//Special Thanks to Sefa Said Deniz @ Beykent Universitesi YM Bölümü

byte mac[] = {
  0xDE, 0xADE, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress ip(172, 16, 144, 178);

// Initialize the Ethernet server library
// with the IP address and port you want to use
// (port 80 is default for HTTP):
EthernetServer server(80);
EthernetClient client;

int sensorPin = A0;


void setup()
{
  
  Serial.begin(9600); // Seri ileti?imi ba?latyyoruz.
 
while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }


  // start the Ethernet connection and the server:
  Ethernet.begin(mac, ip);
  server.begin();
  Serial.print("server is at ");
  Serial.println(Ethernet.localIP());
}

void loop()
{
  
  

  int value = analogRead(sensorPin);
   Serial.println(value);
	
      
   EthernetClient client = server.available();
     // Make a TCP connection to remote host
            
  if (client) {
   
    Serial.println("new client");
    // an http request ends with a blank line
    boolean currentLineIsBlank = true;
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.write(c);
        // if you've gotten to the end of the line (received a newline
        // character) and the line is blank, the http request has ended,
        // so you can send a reply
        if (c == '\n' && currentLineIsBlank) {
          // send a standard http response header
        
      
      
          client.print("{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"geometry\":{\"type\":\"Point\",\"coordinates\":[26.5815421,41.21233689]},\"properties\":{\"id\":\"101011\",\"name\":\"Virtual Sensor 1\",\"info\":\"Blink Sensor\",\"value\":");
          client.print(value);
          client.print("}}]}");
        
          break;
        }
       
      }
    }
    // give the web browser time to receive the data
    delay(1);
    // close the connection:
    client.stop();
    Serial.println("client disconnected");
    Ethernet.maintain();
    
  }
  

// delay(2000);

}