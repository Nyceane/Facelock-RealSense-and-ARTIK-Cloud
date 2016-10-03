/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */

/*
A simple node.js application intended to write data to Digital pins on the Intel based development boards such as the Intel(R) Galileo and Edison with Arduino breakout board.

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/intel-xdk-iot-edition-nodejs-templates
*/


var mraa = require('mraa'); //require mraa
var mqtt = require('mqtt');
var fs = require('fs');

var myDigitalPin5 = new mraa.Gpio(5); //setup digital read on Digital pin #5 (D5)
myDigitalPin5.dir(mraa.DIR_OUT); //set the gpio direction to output

var ID = '<DEVICE ID>';

//console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var PROTOCOL = 'mqtts';
var BROKER ='api.artik.cloud';
var PORT = 8883;
var URL = PROTOCOL + '://' + BROKER;
URL += ':' + PORT;

var AUTHMETHOD = ID;
var AUTHTOKEN = '<DEVICE TOKEN>';


var requireds = { username: AUTHMETHOD, password: AUTHTOKEN };
var mqttConfig = { 'url': URL, 'requireds': requireds };

var client;
client = mqtt.connect(mqttConfig.url, mqttConfig.requireds);
var ACTIONS = '/v1.1/actions/'+ID;

client.on('connect', function () {
    console.log('connect');
    client.subscribe(ACTIONS);
});

client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());  
  myDigitalPin5.write(1); //set the digital pin to high (1)
    
    
  setInterval(function () {    
      closeLock();
  }, 5000);
});

function closeLock(){
    myDigitalPin5.write(0); //set the digital pin to high (0)
}
