const express=require('express');
const route=express.Router();
const chatcontroller=require('../../controller/chat/chatcontroller')
const authentication=require('../../helper/auth')


// route.use(authentication.tokenAuthentication);
route.get('/:userId',chatcontroller.getUerChat);
route.get('/topmost',chatcontroller.getTopMost);




module.exports=route

