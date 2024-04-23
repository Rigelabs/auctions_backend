const { array } = require("joi");
const mongoose =require("mongoose");

const bidsSchema = new mongoose.Schema({
    bid_id:{
        type:String,
        required:true,
        unique:true
    },
    auction_id:{
        type:String,
        required:true,
    },
    bidder_id:{
        type:String,
        required:true,
    },
    bid_minimum_value:{
        type:Number,
        required:true,
        
    },
    bid_maximum_value:{
        type:Number,
        required:true,
    },
    won:{
        type:Boolean,
        default:false,
    },
    bid_deposit_ref:{
        type:String,
        required:true,
        unique:true
    },
   
},{timestamp:true});
module.exports =mongoose.model("Bids",bidsSchema)