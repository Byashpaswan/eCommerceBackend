const express=require('express');
const route=express.Router();
const apiController=require('../../controller/api/api.controller')
const authentication=require('../../helper/auth')


route.use(authentication.tokenAuthentication);
route.use('/api',apiController);


