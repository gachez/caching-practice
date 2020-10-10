const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3128;
const app = express();

//memory-cache
// const cache = require('memory-cache');

// //configure cache middleware
// let memCache = new cache.Cache();
// // memcache function middleware
// let cacheMiddleware = (duration) => {
//     return (req, res, next) => {
//         let key = '__express__' + req.originalUrl || req.originalUrl
//         let cacheContent = memCache.get(key);
//         if(cacheContent){
//             res.send(cacheContent);
//             return
//         } else {
//             res.sendResponse = res.send
//             res.send = (body) => {
//                 memCache.put(key,body,duration*1000);
//                 res.sendResponse(body)
//             }
//             next()
//         }
//     }
// }

// //flat-cache
// const flatCache = require('flat-cache');

// // load new cache
// let cache = flatCache.load('productsCache');

// //flat-cache middleware
// let flatCacheMiddleware = (req,res,next) => {
//     let key = '__express__' + req.originalUrl || req.originalUrl
//     let cacheContent = cache.getKey(key);
//     if(cacheContent){
//         res.send( cacheContent );
//     } else{
//         res.sendResponse = res.send
//         res.send = (body) => {
//             cache.setKey(key, body);
//             cache.save();
//             res.sendResponse(body)
//         }
//         next()
//     }
// }

// Memcached
const Memcached = require('memcached');

let memcached = new Memcached("127.0.0.1:11211")

    let memcachedMiddleware = (duration) => {
        return  (req,res,next) => {
        let key = "__express__" + req.originalUrl || req.url;
        memcached.get(key, function(err,data){
            if(data){
                res.send(data);
                return;
            }else{
                res.sendResponse = res.send;
                res.send = (body) => {
                    memcached.set(key, body, (duration*60), function(err){
                        // 
                    });
                    res.sendResponse(body);
                }
                next();
            }
        });
    }
    };


app.get('/products', memcachedMiddleware(20), function(req, res){
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