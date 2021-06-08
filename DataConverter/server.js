var mqttEnergy = require("./mqttEnergy");
const sqlEnergy = require("./sqlEnergy");

var newSqlEnergyData = [];
var newSqlTempData = [];

mqttEnergy.initConnection();
mqttEnergy.setOnMessage("meter/energy", handleMqttEnergyMessage);
mqttEnergy.setOnMessage("meter/temp", handleMqttTempMessage);

function handleMqttEnergyMessage(message) {
    
    newSqlEnergyData[newSqlEnergyData.length] = parseMeterEnergy(message);

    if (newSqlEnergyData.length >=60) {
        sqlEnergy.sendDataToDatabase(newSqlEnergyData);
        newSqlEnergyData = [];
     }

}

function handleMqttTempMessage(message) {
    newSqlTempData[newSqlEnergnewSqlTempDatayData.length] = parseMeterTemp(message);

    if (newSqlTempData.length >=60) {
        sqlEnergy.sendDataToDatabase(newSqlTempData);
        newSqlTempData = [];
     }
}


function parseMeterEnergy(message) {
    messageJs = JSON.parse(message);

    return [`${messageJs.timestamp}`,               //CurrentTime
     `${messageJs.pwr_consuming}` || null,          //Current Usage
     `${messageJs.pwr_delivering}` || null,         //Currentdelivery
     `${Math.round(messageJs.voltage)}` || null,    //CurrentVoltage1
     `${messageJs.pwr_consuming_total1}` || null,   //TotalReceivedT1
     `${messageJs.pwr_consuming_total2}` || null,   //TotalReceivedT2
     `${messageJs.pwr_delivering_total1}` || null,  //TotalDeliverdT1
     `${messageJs.pwr_delivering_total2}` || null]; //TotalDeliverdT2
}

function parseMeterTemp(message) {
    messageJs = JSON.parse(message);

    return [
        `${messageJs.temperature}` || null, //temperature
        `${messageJs.humidity}` || null     //humidity
        ];   
}


