const redis =require('redis');
const env= require('dotenv');
const logger = require('./logger');

env.config();
// logging, parsing, and session handling with Redis.
const redisHost= process.env.REDIS_HOST;
const redisPort =process.env.REDIS_PORT;
const redisPassword =process.env.REDIS_PASSWORD;

const redisClient =  redis.createClient({
  host:redisHost,
  port:redisPort,
  password:redisPassword,
  enable_offline_queue:false
});
 
redisClient.on("connect",()=>{
    console.log("Connected to Redis")
  
  })
redisClient.on("error",(error)=>{
  console.log("Redis error",error)
   
  })
redisClient.on("end",(error)=>{
  console.log("Redis error",error)
    console.log("Disconnected from Redis: ", error)
  })
 
module.exports=redisClient;