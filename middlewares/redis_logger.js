const redis =require('redis');
const env= require('dotenv');


env.config();
// logging, parsing, and session handling with Redis.
const redisHost= process.env.LOGGING_REDIS_HOST;
const redisPort =process.env.LOGGING_REDIS_PORT;
const redisPassword =process.env.LOGGING_REDIS_PASSWORD;

const redisClientLogger =new redis.createClient({
  host:redisHost,
  port:redisPort,
  password:redisPassword,
  enable_offline_queue:true
});
redisClientLogger.on("connect",()=>{
    console.log("Connected to Redis Logger")
  
  })
  redisClientLogger.on("error",(error)=>{
  console.log("Logger Redis error",error)
   
  })
  redisClientLogger.on("end",(error)=>{

    console.log("Logger Disconnected from Redis: ", error)
  })

module.exports=redisClientLogger;