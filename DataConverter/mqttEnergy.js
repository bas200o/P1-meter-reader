const { MqttClient } = require('mqtt');
var mqtt = require('mqtt');
var client;

var connected = false;
const callbacks = new Map();

function initConnection() {
    client = mqtt.connect("mqtt://plex.shitposts.nl:1883", {
        protocol: 'mqtt',
        username: 'meter',
        password: 'hamenkaastostie'
    });

    console.log("Entered init connection");
    client.on('connect', function () {
        connected = true;
        console.log("Connected to mqtt");
        for (topic in callbacks.keys()) {
            client.subscribe(topic);
        }
    });  
    
    client.on('message', function (topic, message) {
        if (callbacks.has(topic)) {
            callbacks.get(topic)(message);
        } 
        return;
    });
}

function setOnMessage(topic, callback) {
    if (!callbacks.has(topic)) {
        callbacks.set(topic, callback);
        client.subscribe(topic);
        return true;
    }
    return false;
}


exports.setOnMessage = setOnMessage;
exports.initConnection = initConnection;
exports.connected = connected;