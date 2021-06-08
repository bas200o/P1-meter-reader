const express = require('express');
const router  = express.Router();

const test    = require("../controller/test");
const lucas   = require("../controller/lucas");
const sqlGet  = require("../controller/sqlGet");

router.get('/test', test.test);
router.get('/lucas', lucas.doAthing);
router.get('/getNulls', sqlGet.getNulls);
router.get('/getLatestH2', sqlGet.getLatest2h);
router.get('/getCurrent', sqlGet.getCurrent);
router.get('/getDay', sqlGet.getDay);
router.get('/getWeek', sqlGet.getWeek);
router.get('/getMonth', sqlGet.getMonth);
router.get('/getYear', sqlGet.getYear);
router.get('/getTemp', sqlGet.getTemp);

module.exports = router;
