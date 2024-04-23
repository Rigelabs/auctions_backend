const { RateLimiterMemory } = require('rate-limiter-flexible');
const logger = require('../logger');


const opts = {
    points: 100,// number of points
    duration: 60,//per 60seconds
    blockDuration: 60*60, // Block for 1 day, if all points are consumed in i minute
   
};

const rateLimiter = new RateLimiterMemory(opts);

const generalrateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.connection.remoteAddress,2)
        .then((rateLimiterRes) => {
         next();
         })
          .catch((rejRes) => {
            if(rejRes instanceof Error){
              console.log(rejRes);
              res.status(500).json({message:'Request not processed'});
              logger.error("Redis Error in Generic limiter", rejRes)
            }else{
              const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
              res.status(429).json({message:'Request not processed, you have sent too many requests'});
           
            logger.error(` Retry-After - ${String(secs)} Seconds - ${res.statusMessage}-${rejRes.status || 429} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
            }
          });
  
          
      };

module.exports =generalrateLimiterMiddleware;