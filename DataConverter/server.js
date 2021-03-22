var mqttEnergy = require("./mqttEnergy");
const sqlEnergy = require("./sqlEnergy");

var newSqlData = [];

mqttEnergy.initConnection();
mqttEnergy.setOnMessage("meter/energy", handleMqttEnergyMessage);

function handleMqttEnergyMessage(message) {
    
    newSqlData[newSqlData.length] = parseMeterEnergy(message);

    if (newSqlData.length >=60) {
        sqlEnergy.sendDataToDatabase(newSqlData);
        newSqlData = [];
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


