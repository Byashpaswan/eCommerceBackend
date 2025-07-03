var express = require('express');
var router = express.Router();
var userRouter = require('./user.route.js/user.route')
var apiRouter=require('./api/api.route');
var chatRouter=require('./chat/chat.route')

router.use('/user',userRouter);
router.use('/api',apiRouter);
router.use('/chat',chatRouter);

module.exports = router;
