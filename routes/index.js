var express = require('express');
var router = express.Router();
var userRouter = require('./user.route.js/user.route')


router.use('/user',userRouter)

module.exports = router;
