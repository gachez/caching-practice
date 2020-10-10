const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3128;
const app = express();


app.get('/products',  function(req, res){
    setTimeout(() => {
      let db = new sqlite3.Database('./NodeInventory.db');
      let sql = `SELECT * FROM products`;

      db.all(sql, [], (err, rows) => {
          if (err) {
              throw err;
          }
          db.close();
          res.send( rows );
      });
      // this was wrapped in a setTimeout function to intentionally simulate a slow 
      // request
    }, 3000);
});

app.listen(PORT, function(){
    console.log(`App running on port ${PORT}`);
});