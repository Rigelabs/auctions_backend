const { array } = require("joi");
const mongoose =require("mongoose");

const auctionsSchema = new mongoose.Schema({
    auction_id:{
        type:String,
        required:true,
        unique:true
    },
    auction_title:{
        type:String,
        required:true,
        
    },
    
    auctioneer_id:{
        type:String,
        required:true,
    },
    beneficiary_id:{
        type:String,
        required:true,
    },
    auction_start_time:{
        type:Date,
        required:true,
    },
    bidding_start_time:{
        type:Date,
        required:true,
    },
    bidding_end_time:{
        type:Date,
        required:true,
    },
    auction_end_time:{
        type:Date,
        required:true,
    },
    date_closed:{
        type:Date,
        
    },
    date_settled:{
        type:Date,
       
    },
    settled:{
        type:Boolean,
        default:false,
    },
    images:{
        type:Array,
       
    },
    images_id:{
        type:Array,
       
    },
    location:{
        type:Object,
        required:true, 
    },
    video:{
        type:String,
    },
    video_id:{
        type:String,
    },
    reserved_price:{
        type:Number,
        required:true,
    },
    increment_value:{
        type:Number,
        
    },
    deposit_value:{
        type:Number,
        required:true,
    },
    category_id:{
        type:String,
        required:true,
    },
    sub_category_id:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    item_condition:{
        type:String,
        enum:["New no warranty","New under warranty","Used but working","Used not working","Scrap"] 
    },
    warranty_period:{
        type:String,
        default:"No Warranty"
    },
    stage:{
        type:String,
        default:"Pending",
        enum:["Open","Closed","Ongoing","Suspended","Pending"] 
    },
    allocated_group:{
        type:String,
        default:"Open",
        enum:["Person With Disability","Women","Youth","Open"] 
    }
},{timestamp:true});
module.exports =mongoose.model("Auctions",auctionsSchema)