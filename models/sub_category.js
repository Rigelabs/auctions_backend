const { array } = require("joi");
const mongoose =require("mongoose");

const sub_categorySchema = new mongoose.Schema({
    sub_category_id:{
        type:String,
        required:true,
        unique:true
    },
    category_id:{
        type:String,
        required:true,
    },
    sub_category_name:{
        type:String,
        required:true,
        unique:true
    },
   
   
},{timestamp:true});
module.exports =mongoose.model("Sub_Category",sub_categorySchema)