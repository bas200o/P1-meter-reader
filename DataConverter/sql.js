const mysql = require("mysql");

function sendEnergyDataToDatabase(newSqlData) {
    var mysqlConnection = mysql.createConnection({
        host : "plex.shitposts.nl",
        user : "meterboi",
        password : "hamenkaas",
        database : "meterbase",
        multipleStatements: true
    });
    
    mysqlConnection.connect((err)=>{ 
        if (!err) {
            
        var sql = "INSERT INTO energy (CurrentTime, CurrentUsage, Currentdelivery, CurrentVoltage1, TotalReceivedT1, TotalReceivedT2, TotalDeliverdT1, TotalDeliverdT2) VALUES ?";
    
        mysqlConnection.query(sql, [newSqlData], function (err, result) {
        if (err) {
            console.log(err.message);
            console.log("Query error");
        };
            // console.log(`Data has succesful been send`);
            mysqlConnection.destroy();
        });
    
        } else {
            console.log(err.message);
            console.log("Connection error");
        }
    });
}

function sendTempDataToDatabase(sqlData) {
    var mysqlConnection = mysql.createConnection({
        host : "plex.shitposts.nl",
        user : "meterboi",
        password : "hamenkaas",
        database : "meterbase",
        multipleStatements: true
    });
    
    mysqlConnection.connect((err)=>{ 
        if (!err) {
            
        var sql = `INSERT INTO temp VALUES (CURRENT_TIMESTAMP, ${sqlData.temperature}, ${sqlData.humidity});`;

        mysqlConnection.query(sql, function (err, result) {
            if (err) {
                // console.log(err.message);
                console.log("Query error");
            };
            mysqlConnection.destroy();
        });
    
        } else {
            console.log(err.message);
            console.log("Connection error");
        }
    });
}




exports.sendEnertgyDataToDatabase = sendEnergyDataToDatabase;
exports.sendTempDataToDatabase =    sendTempDataToDatabase;