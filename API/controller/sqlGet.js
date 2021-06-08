const sql = require("./sql");

async function getNulls(req, res, next) {
    var sqlData = await sql.runQuery("SELECT * FROM energy WHERE CurrentUsage IS NULL;");
    res.status(200).json(sqlData);
}

async function getLatest2h(req, res, next) {
    var sqlData = await sql.runQuery("SELECT *  FROM energy ORDER BY CurrentTime DESC LIMIT 120;");
    res.status(200).json(sqlData);
}

async function getCurrent(req, res, next) {
    var sqlData = await sql.runQuery("SELECT * FROM energy ORDER BY CurrentTime DESC LIMIT 1;");
    res.status(200).json(sqlData);
}

async function getDay(req, res, next) {
    var sqlData = await sql.runQuery("SELECT * FROM meterbase.energy where CurrentTime > date_sub(now(), interval 1 day);");
    res.status(200).json(sqlData);
}

async function getWeek(req, res, next) {
    var sqlData = await sql.runQuery("SELECT * FROM meterbase.energy where CurrentTime > date_sub(now(), interval 1 week);");
    res.status(200).json(sqlData);
}

async function getMonth(req, res, next) {
    var sqlData = await sql.runQuery("SELECT * FROM meterbase.energy where CurrentTime > date_sub(now(), interval 1 month);");
    res.status(200).json(sqlData);
}

async function getYear(req, res, next) {
    var sqlData = await sql.runQuery("SELECT * FROM meterbase.energy where CurrentTime > date_sub(now(), interval 1 year);");
    res.status(200).json(sqlData);
}

async function getTemp(req, res, next) {
    var sqlData = await sql.runQuery("SELECT * FROM meterbase.temp ORDER BY created_at DESC LIMIT 1;");
    res.status(200).json(sqlData);
}

var Module = module.exports;
Module.getNulls = getNulls;
Module.getLatest2h = getLatest2h;
Module.getCurrent = getCurrent;
Module.getDay = getDay;
Module.getWeek = getWeek;
Module.getMonth = getMonth;
Module.getYear = getYear;

Module.getTemp = getTemp;