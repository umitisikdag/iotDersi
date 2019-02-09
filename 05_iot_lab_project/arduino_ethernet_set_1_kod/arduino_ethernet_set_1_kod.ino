#include <dht.h>
#include <Dhcp.h>
#include <Dns.h>
#include <Ethernet.h>
#include <EthernetClient.h>
#include <EthernetServer.h>
#include <EthernetUdp.h>
#include <SPI.h>
dht DHT;
#define DHT11_PIN 2

byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress ip(172, 16, 144, 177);

// Initialize the Ethernet server library
// with the IP address and port you want to use
// (port 80 is default for HTTP):
EthernetServer server(80);
EthernetClient client;

//int sensorPin = A0;


void setup()
{
  
  Serial.begin(9600); // Seri ileti�imi ba�lat�yoruz.
 
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
  
  

  int A0read = analogRead(A0);
  int A1read = analogRead(A1);
  int chk = DHT.read11(DHT11_PIN);
      
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
        
      
      
          client.println("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
          client.println("<board>");
           client.println("<roomId>");
             client.println("1");
           client.println("</roomId>");
           client.println("<sensors>");
           
           
           
             client.println("<sensor>");
              client.println("<Id>");
              client.println("01");
               client.println("</Id>");
               client.println("<snsType>");
               client.println("light");
               client.println("</snsType>");
               client.println("<snsValue>");
                client.println(A0read);
               client.println("</snsValue>");
              client.println("</sensor>");
              
               client.println("<sensor>");
              client.println("<Id>");
              client.println("02");
               client.println("</Id>");
               client.println("<snsType>");
               client.println("rain");
               client.println("</snsType>");
               client.println("<snsValue>");
                client.println(A1read);
               client.println("</snsValue>");
              client.println("</sensor>");

              client.println("<sensor>");
              client.println("<Id>");
              client.println("03");
               client.println("</Id>");
               client.println("<snsType>");
               client.println("temprature");
               client.println("</snsType>");
               client.println("<snsValue>");
               client.println(DHT.temperature);
               client.println("</snsValue>");
              client.println("</sensor>");
              
              client.println("<sensor>");
              client.println("<Id>");
              client.println("04");
               client.println("</Id>");
               client.println("<snsType>");
               client.println("humidity");
               client.println("</snsType>");
               client.println("<snsValue>");
               client.println(DHT.humidity);
               client.println("</snsValue>");
              client.println("</sensor>");



              
                  
               client.println("</sensors>");
               client.println("</board>");
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
  

  delay(2000);

}
