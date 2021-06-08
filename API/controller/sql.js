const mysql = require("mysql");

async function runQuery(query) {
    var mysqlConnection = mysql.createConnection({
        host : "plex.shitposts.nl",
        user : "meterboi",
        password : "hamenkaas",
        database : "meterbase",
        multipleStatements: true
    });

    var queryPrommise = new Promise((resolve, reject) => {
        mysqlConnection.connect((err)=>{ 
            if (err) {
                reject(err);
            } else {
                mysqlConnection.query(query, function (err, result) {
                    if (err) {
                        reject(err);
                    };
                        resolve(result);
                        mysqlConnection.destroy();
                    });
            }
        });

    });

    return queryPrommise;
    

}

var Module = module.exports;
Module.runQuery = runQuery;


