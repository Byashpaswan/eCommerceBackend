const Mongoose=require('mongoose');
const chatModel=require('../model/chat/chat.model');



module.exports=Mongoose.model('chat',chatModel);