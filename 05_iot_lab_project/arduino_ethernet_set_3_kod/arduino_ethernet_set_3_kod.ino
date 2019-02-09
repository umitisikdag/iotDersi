
#include <Dhcp.h>
#include <Dns.h>
#include <Ethernet.h>
#include <EthernetClient.h>
#include <EthernetServer.h>
#include <EthernetUdp.h>
#include <SPI.h>


byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xBD
};
IPAddress ip(172, 16, 144, 176);

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
  int A2read = analogRead(A2);
  int A3read = analogRead(A3);
  int A4read = analogRead(A4);
  
      
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
              client.println("10");
               client.println("</Id>");
               client.println("<snsType>");
               client.println("mq3");
               client.println("</snsType>");
               client.println("<snsValue>");
                client.println(A0read);
               client.println("</snsValue>");
              client.println("</sensor>");
              
               client.println("<sensor>");
              client.println("<Id>");
              client.println("11");
               client.println("</Id>");
               client.println("<snsType>");
               client.println("mq7");
               client.println("</snsType>");
               client.println("<snsValue>");
                client.println(A1read);
               client.println("</snsValue>");
              client.println("</sensor>");

              client.println("<sensor>");
              client.println("<Id>");
              client.println("12");
               client.println("</Id>");
               client.println("<snsType>");
               client.println("mq5");
               client.println("</snsType>");
               client.println("<snsValue>");
               client.println(A2read);
               client.println("</snsValue>");
              client.println("</sensor>");
              
              client.println("<sensor>");
              client.println("<Id>");
              client.println("13");
               client.println("</Id>");
               client.println("<snsType>");
               client.println("mq4");
               client.println("</snsType>");
               client.println("<snsValue>");
               client.println(A3read);
               client.println("</snsValue>");
              client.println("</sensor>");

              
              client.println("<sensor>");
              client.println("<Id>");
              client.println("14");
               client.println("</Id>");
               client.println("<snsType>");
               client.println("mq2");
               client.println("</snsType>");
               client.println("<snsValue>");
               client.println(A4read);
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
