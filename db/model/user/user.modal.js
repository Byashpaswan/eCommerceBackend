const mongoose=require('mongoose');

const Address=mongoose.Schema({
    street:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    zipCode:{
        type:String,
        required:true
    }
},{_id:false})  




const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },

    pass:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },  
    phone:{
        type:String,
        required:false
    },
    address:{
        type:Address,
        required:false
    }
},{timestamps:true})


module.exports=userSchema