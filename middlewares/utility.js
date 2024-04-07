const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

const send_subsriber_id=()=>{
    
//generate json web token for logging service ;
const token = jwt.sign({ subsriber_id: process.env.LOGGING_SUB_ID,date:new Date()},process.env.TOKEN_SECRET)
const requestUrl = new URL(`${process.env.LOGGING_SERVICE_LOCAL}/onboarding`);
var config={
 headers:{"Authorization":`Bearer ${token}`},
}
var data={subscriber_id:process.env.LOGGING_SUB_ID}

    axios.post(requestUrl.href,data,config).catch(error=>{
                 console.log(`Failed to send to onboard to Logging Service, ${error}`)
             }) 
}

module.exports = send_subsriber_id;