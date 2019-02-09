var express = require('express')
var mqtt    = require('mqtt');
var bodyParser = require('body-parser');

//client.end();
var app         = express(),
    config      = {
                      routes:{
                          index: "/",
			              test:  "/test",
                          user:  "/user/:id",
                          person: "/person/:id/:operation?",
                          aday : "/aday/:id/:ad?",
                          sendjson : "/sendjson",
                          kml :     "/kml?",
                          google :  "/google/:cntry",
                          form :    "/form",
                          posthandler :  "/posthandler",
                          puthandler  :  "/user/:id",
                          deletehandler : "/user/:id",
						  sensorgen		:"/sensorgen",
						  geojson		:"/geojson",
						  stats		    :"/stats"

                      }
                  };
// create application/json parser
var jsonParser = bodyParser.json({ type: 'application/*+json' });
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//create a text parser
var textParser=bodyParser.text({ type: 'text/html' });
//create a raw parser
var rawParser=bodyParser.raw({ type: 'application/vnd.custom-type' });
//use all of the parsers to handle the post request
app.use(jsonParser);
app.use(urlencodedParser);
app.use(textParser);
app.use(rawParser);


var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
app.get(config.routes.index, function(req, res) {
    res.send("<h1>Hello World!</h1>")
});
app.get(config.routes.test, function(req, res) {
    res.send("<h1>Hello Test!</h1>")
});
app.get(config.routes.user, function(req, res) {
    res.send("<h1>Hello user</h1>"+req.params.id)
});
app.get(config.routes.person, function(req, res) {
    res.send("<h1>Hello user</h1>"+" Id= "+req.params.id+" Operating "+req.params.operation+" ad= "+req.query["ad"]+" soyad "+req.query["soyad"])
});
app.get(config.routes.aday, function(req, res) {
if (req.params.id == 1 )
    {
       res.sendfile('1.txt');
    } 
    else 
    {
       res.send("<h1>Hello user</h1>"+" Id= "+req.params.id+" Adiniz "+req.params.ad)
    }
   
});
app.get(config.routes.sendjson, function(req, res) {
 // We want to set the content-type header so that the browser understands
  //  the content of the response.
  res.contentType('application/json');

  // Normally, the would probably come from a database, but we can cheat:
  var people = [
    { name: 'Dave', location: 'Atlanta' },
    { name: 'Santa Claus', location: 'North Pole' },
    { name: 'Man in the Moon', location: 'The Moon' }
  ];

  // Since the request is for a JSON representation of the people, we
  //  should JSON serialize them. The built-in JSON.stringify() function
  //  does that.
  var peopleJSON = JSON.stringify(people);

  // Now, we can use the response object's send method to push that string
  //  of people JSON back to the browser in response to this request:
  res.send(peopleJSON);
    
});
app.get(config.routes.kml, function(req, res) {
 var s =   "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+
            "\r\n"+
            "<kml xmlns=\"http://www.opengis.net/kml/2.2\">"+
            "\r\n"+
            "<Document>"+
            "\r\n"+
            "<Placemark id=\"MyRoom\">"+
            "\r\n"+
            "<name>Alfa Group Test</name>"+
            "\r\n"+
            "<ExtendedData>"+
            "\r\n"+
            "<Data name=\"Light Condition @ Voltage \">"+
            "\r\n"+
            "<value>"+
            "\r\n"+
            "hey hey"+ 
            "\r\n"+
            "</value>"+
            "\r\n"+
            "</Data>"+
            "\r\n"+
            "</ExtendedData>"+
            "\r\n"+
            "<Point>"+
            "\r\n"+
            "<coordinates>"+req.query["lon"]+","+req.query["lat"]+"</coordinates>"+
            "\r\n"+
            "</Point>"+
            "\r\n"+
            "</Placemark>"+
            "\r\n"+
            "</Document>"+
            "\r\n"+
            "</kml>";  
        
//"HTTP/1.1 200 OK\r\n Content-Type: application/xml\r\n charset=utf-8\r\n\r\n"

          res.send(s);

});
app.get(config.routes.google, function(req, res) {
    res.redirect('http://www.google.com.'+req.params.cntry)
});
app.get(config.routes.form, function(req, res) {
var body = 
'<form action="/posthandler" method="post">'+
'<input type="text" name="id"></text>'+
'<input type="submit" value="Submit text" />'+
'</form>';

    res.send(body)
});
app.post(config.routes.posthandler, function(req, res) {
 
var myid = req.body.id;

    res.send("<h1>Hello World!</h1>"+ myid)
});
app.put(config.routes.puthandler, function(req, res) {
 
var myid = req.params.id;

    res.send("<h1>Hello World! Put is working</h1>"+ myid)
});
app.delete(config.routes.deletehandler, function(req, res) {
 
var myid = req.params.id;

    res.send("<h1>Hello World! Heyoo Delete is working</h1>"+ myid)
});

app.get(config.routes.sensorgen, function(req, res) {
 var builder = require('xmlbuilder');
 var fs = require("fs");
 var path = "c:\\Temp\\board_ders.xml";
 var latmin= parseFloat(req.query["latmin"]);
 var latmax=parseFloat(req.query["latmax"]);
 var lonmin= parseFloat(req.query["lonmin"]);
 var lonmax=parseFloat(req.query["lonmax"]);
 var sensorno=parseInt(req.query["sensorno"]);
 var descriptions=["Heat Sensor","Luminance Sensor","Crack Sensor","Sound Sensor","CO2 Sensor","CO Sensor","Radiation Sensor"];
    
	var root = builder.create('rss');

	root.att('xmlns', 'http://www.w3.org/2005/Atom');
	root.att('xmlns:georss', 'http://www.georss.org/georss');
	root.att('xmlns:geo', 'http://www.w3.org/2003/01/geo/wgs84_pos#');
	root.att('xmlns:gml', 'http://www.opengis.net/gml');
	root.att('version', '2.0');
	root.com('f(x) = x^2');
	
	var channel =root.ele('channel');
	channel.ele('title', 'SensorSet');
	channel.ele('description', 'SensorSetD');
	channel.ele('link', 'SensorSetD');
	channel.ele('georss:box', '39.55 28.58 41 32.50');
	for(var i = 1; i <= sensorno; i++)
	{
		var randomlat=randomFloatBetween(latmin,latmax,8);
		var randomlatst=randomlat.toString();
		var randomlon=randomFloatBetween(lonmin,lonmax,8);
		var randomlonst=randomlon.toString();
		var emtpy= " ";
		var random_ccord= randomlatst.concat(emtpy,randomlonst);
		
		var desc = descriptions[Math.floor(Math.random()*descriptions.length)];
		
		var randomsensorvalue=randomFloatBetween(-1000,1000,3);
		
		var sensor_title='Virtual Sensor' + " " + i.toString();
		
	  var item = channel.ele('item');
	  //item.att('x', i);   -->Attribute eklemek için
	  item.ele('title',sensor_title);
	  item.up();
	  item.ele('description',desc);
	  item.up();
	  item.ele('link','testd');
	  item.up();
	  item.ele('value',randomsensorvalue);
	  item.up();
	  item.ele('geo:lat',randomlatst);
	  item.up();
	  item.ele('geo:lon',randomlonst);
	  item.up();
	  item.ele('georss:point',random_ccord);
	  item.up();
	}
	var prt=root.end({ pretty: true});

	fs.writeFile(path, prt, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	}); 
	
	res.send("<h1>File Saved</h1>")
 });
 app.get(config.routes.geojson, function(req, res) {
	
	/*-------------------------------------------------------------------------------Diger Metod--------------------------------------
	var x = {
    type: 'FeatureCollection',
    features: [
				for (i=0;i<=10;i++)
				{
						{
						type: 'Feature',
						geometry : {
							type : 'Point',
							coordinates : [1,2]
									},
						properties :
									{
							id : 111,
							name : "www",
							info : "asasa",
							value : "2222",
									}
						},
				}
			]
		};
		
		-----------------------------------------------------------------------------------------------------------------------------------*/
	 var latmin= parseFloat(req.query["latmin"]);
	 var latmax=parseFloat(req.query["latmax"]);
	 var lonmin= parseFloat(req.query["lonmin"]);
	 var lonmax=parseFloat(req.query["lonmax"]);
	 var descriptions=["Heat Sensor","Luminance Sensor","Crack Sensor","Sound Sensor","CO2 Sensor","CO Sensor","Radiation Sensor"];	
	 var sensorno=parseInt(req.query["sensorno"]);	
	 var fs = require("fs");
     var path = "c:\\Temp\\board_ders.json";
	 
	features_arr=[]
		
		for(i=0;i<sensorno;i++)
		{
		var randomlat=randomFloatBetween(latmin,latmax,8);
		var randomlon=randomFloatBetween(lonmin,lonmax,8);
		var desc = descriptions[Math.floor(Math.random()*descriptions.length)];
		var randomsensorvalue=randomFloatBetween(-1000,1000,3);
		var sensor_title='Virtual Sensor' + " " + i.toString();
		
		//----------------------------------
		feature_geometry=new Object()
		feature_geometry.type="Point"
		feature_geometry.coordinates=[randomlon,randomlat]
			
		//----------------------------------	
        feature_properties=new Object()
        feature_properties.id="10101"+ i.toString(); 
        feature_properties.name=sensor_title
		feature_properties.info=desc
		feature_properties.value=randomsensorvalue
		
		//-------------------------------------
		feature_obj=new Object()
		feature_obj.type="Feature"
		feature_obj.geometry=feature_geometry
		feature_obj.properties=feature_properties
		features_arr.push(feature_obj)
		}

		feature_collection =new Object()
		feature_collection.type="FeatureCollection"
		feature_collection.features=features_arr
		
		geojson=new Object()
		geojson=feature_collection
			
	jsonme=JSON.stringify(feature_collection);
	if(sensorno<10000)
	{
	res.send(jsonme);
	}
    else
    {
    res.send("Saving JSON to file");
    }
	
		fs.writeFile(path, jsonme, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	});
});
 
  
 app.get(config.routes.stats, function(req, res) {

 var ss = require('simple-statistics');

 var request = require('request');

 var path=req.query["path"];
 
 request(path, function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
     var jsonobj = JSON.parse(body);  //Gelen JSON ı objeye cevirme
	 
	//------------Okuduğu JSON u sayfaya geri yazar------------------- 
	// jsonme=JSON.stringify(jsonobj);
	// res.send(jsonme);
	//----------------------------------------------------------------
	
	/*---------------------------Direct Access to Objects------------
	var v1=jsonobj.features[0].geometry.coordinates[0];
	var v2=jsonobj.features[0].geometry.coordinates[1];
	var r_id= jsonobj.features[0].properties.id;
	var r_name= jsonobj.features[0].properties.name;
	var r_info= jsonobj.features[0].properties.info;
	var r_value= jsonobj.features[0].properties.value;
	------------------------------------------------------------------*/
	var feature_number = Object.keys(jsonobj.features).length;     //Kac adet feature var onu buluyorum
	var feature_number_str = feature_number.toString();
	var value_arr_heat=[];
	var value_arr_lum=[];
	var value_arr_crack=[];
	var value_arr_sound=[];
	var value_arr_cotwo=[];
	var value_arr_co=[];
	var value_arr_rad=[];
	
	for(i=0;i<feature_number;i++)
	{
	var r_info= jsonobj.features[i].properties.info;    //Sensor turu nedir ?
	var r_value=jsonobj.features[i].properties.value;   //Sensorun degeri nedir ?
	
		switch(r_info)                                  //Sensor turune gore sensorlerı ayırıstırıp her bır sensor degerini bir array e atıyorum
		{
			case "Heat Sensor":value_arr_heat.push(r_value);break;
			case "Luminance Sensor":value_arr_lum.push(r_value);break;
			case "Crack Sensor":value_arr_crack.push(r_value);break;
			case "Sound Sensor":value_arr_sound.push(r_value);break;
			case "CO2 Sensor":value_arr_cotwo.push(r_value);break;
			case "CO Sensor":value_arr_co.push(r_value);break;
			case "Radiation Sensor":value_arr_rad.push(r_value);break;
			default:
        	
		}
	
	}
//-------------------------------Produce a JSON output showing sensor statistics----------------------------------------------------------

    var heat_no=value_arr_heat.length.toString();
    var lum_no=value_arr_lum.length.toString();
	var crack_no=value_arr_crack.length.toString();
	var sound_no=value_arr_sound.length.toString();
	var cotwo_no=value_arr_cotwo.length.toString();
	var co_no=value_arr_co.length.toString();
	var rad_no=value_arr_rad.length.toString();
    
	numberset=new Object()
	numberset.heat=heat_no;
	numberset.lum=lum_no;
	numberset.crack=crack_no;
	numberset.sound=sound_no;
	numberset.cotwo=cotwo_no;
	numberset.co=co_no;
	numberset.rad=rad_no;

	
	var heat_mean = ss.mean(value_arr_heat);
	var lum_mean = ss.mean(value_arr_lum);
	var crack_mean = ss.mean(value_arr_crack);
	var sound_mean = ss.mean(value_arr_sound);
	var cotwo_mean = ss.mean(value_arr_cotwo);
	var co_mean = ss.mean(value_arr_co);
	var rad_mean = ss.mean(value_arr_rad);
	
	meanset=new Object()
	meanset.heatmean=heat_mean;
	meanset.lummean=lum_mean;
	meanset.crackmean=crack_mean;
	meanset.soundmean=sound_mean;
	meanset.cotwomean=cotwo_mean;
	meanset.comean=co_mean;
	meanset.radmean=rad_mean;
	
    var heat_std = ss.standardDeviation(value_arr_heat);
	var lum_std = ss.standardDeviation(value_arr_lum);
	var crack_std = ss.standardDeviation(value_arr_crack);
	var sound_std = ss.standardDeviation(value_arr_sound);
	var cotwo_std = ss.standardDeviation(value_arr_cotwo);
	var co_std = ss.standardDeviation(value_arr_co);
	var rad_std = ss.standardDeviation(value_arr_rad);
	
    stdset=new Object()
	stdset.heatstd=heat_std;
	stdset.lumstd=lum_std;
	stdset.crackstd=crack_std;
	stdset.soundstd=sound_std;
	stdset.cotwostd=cotwo_std;
	stdset.costd=co_std;
	stdset.radstd=rad_std;
	
	var heat_variance = ss.variance(value_arr_heat);
	var lum_variance = ss.variance(value_arr_lum);
	var crack_variance = ss.variance(value_arr_crack);
	var sound_variance = ss.variance(value_arr_sound);
	var cotwo_variance = ss.variance(value_arr_cotwo);
	var co_variance = ss.variance(value_arr_co);
	var rad_variance = ss.variance(value_arr_rad);
	
    varianceset=new Object()
	varianceset.heatvariance=heat_variance;
	varianceset.lumvariance=lum_variance;
	varianceset.crackvariance=crack_variance;
	varianceset.soundvariance=sound_variance;
	varianceset.cotwovariance=cotwo_variance;
	varianceset.covarianceco_variance;
	varianceset.radvariance=rad_variance;
	
	resultset=new Object()
	resultset.numberofsensors=numberset;
	resultset.means=meanset;
	resultset.stddevs=stdset;
	resultset.variances=varianceset;
	
	jsonme=JSON.stringify(resultset);
	res.send(jsonme);
//------------------------------------------------------------------------------------------------------------------------------------
	}
   });
 });
//-------------------------------------------------------------------------------------------------------------------------------------


 
//RandomFloatingPointNumber Generator 
 function randomFloatBetween(minValue,maxValue,precision){
    if(typeof(precision) == 'undefined'){
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
}




//////////////////////////////////////////////////////////////KAYNAKLAR/////////////////////////////////////////////////////// 
//http://clientexpressjs.com/examples/routing

//http://www.thecodinghumanist.com/blog/archives/2011/5/6/serving-static-files-from-node-js

//http://www.ustream.tv/recorded/11434722

//http://howtonode.org/express-mongodb

//https://github.com/CloudMQTT/mqtt-sse/blob/master/server.js MQTT+EXPRESS.JS

///////////////////////////////////////////////////////////////MQTT SAMPLES//////////////////////////////////////////////////////

//MQTT ler için iç server MQTT port u 1883 dış port 1883 olarak Modem de açılmalı

//Sample MQTT Request
//http://localhost:3000/mqtget/192.168.1.25/ch?channel=test/umit
//http://umitwin.ddns.net:8081/mqtget/oyak.ddns.net/ch?channel=test/umit

//Sample MQTT Publish
//http://localhost:3000/mqtsend/192.168.1.25/payload?channel=test/umit&message=HelloWorld
//http://umitwin.ddns.net:8081/mqtsend/oyak.ddns.net/payload?channel=test/umit&message=HelloWorld44


////////////////////////////////////////////////////////////OTHER SAMPLES/////////////////////////////////////////////////////////////

// http://localhost:3000/test
// http://localhost:3000/user/1
// http://localhost:3000/person/1/ekle?ad=ahmet&soyad=yilmaz
//http://localhost:3000/aday/1/ahmet
//http://localhost:3000/aday/2/ahmet
//http://localhost:3000/sendjson
//http://localhost:3000/kml?lat=12&lon=12
//http://localhost:3000/google/tr
//http://localhost:3000/form
// PUT Handler HTTP PUT http://localhost:3000/user/2
// DELETE Handler HTTP DELETE http://localhost:3000/user/2

//http://localhost:8081/sensorgen?latmin=10&latmax=11&lonmin=21&lonmax=45&sensorno=1000

//http://localhost:8081/geojson?latmin=26&latmax=45&lonmin=36&lonmax=42&sensorno=100

//http://localhost:8081/stats?path=http://umitwin.ddns.net/tests/node_out/board_ders.json

//Memory arttırmak 8 gb => node --max-old-space-size=6800 app.js   