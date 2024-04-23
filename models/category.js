const { array } = require("joi");
const mongoose =require("mongoose");

const categorySchema = new mongoose.Schema({
    category_id:{
        type:String,
        required:true,
        unique:true
    },
    category_name:{
        type:String,
        required:true,
        unique:true
    },
   
   
},{timestamp:true});
module.exports =mongoose.model("Category",categorySchema)