const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3128;
const app = express();

//memory-cache
const cache = require('memory-cache');

//configure cache middleware
let memCache = new cache.Cache();
// memcache function middleware
let cacheMiddleware = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.originalUrl
        let cacheContent = memCache.get(key);
        if(cacheContent){
            res.send(cacheContent);
            return
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                memCache.put(key,body,duration*1000);
                res.sendResponse(body)
            }
            next()
        }
    }
}


app.get('/products', cacheMiddleware(30), function(req, res){
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