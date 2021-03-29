const express = require('express');
const router  = express.Router();

const fs = require('fs');

router.get('/main.js', getMain);

function getMain(req, res, next) {
    res.type('.js');
    fs.readFile("./static/js/main.js", 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        res.status(200).send(data);
        
      })

    // res.status(200).send('console.log("You gay");');
}

module.exports = router;