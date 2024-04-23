const { array } = require("joi");
const mongoose =require("mongoose");

const biddersSchema = new mongoose.Schema({
    bidder_id:{
        type:String,
        required:true,
        unique:true
    },
    physical_location:{
        type:Object,
        required:true,
    },
    identification:{
        type:String,
        required:true,
        unique:true
    },
    kra_pin:{
        type:String,
        required:true,
        unique:true
    },
    full_name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone_number:{
        type:String,
        required:true,
        unique:true
    },
    kyc:{
        type:Object,
        required:true,
        
    },
    geo_data:{
        type:Object,
        required:true,
    },
    status:{
        type:String,
        default:"Pending",
        enum:["Active","Suspended","Pending"] 
    },
    password:{
        type:String,
        required:true,
    },
   
},{timestamp:true});
module.exports =mongoose.model("Bidders",biddersSchema)