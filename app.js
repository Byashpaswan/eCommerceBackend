var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var compression=require('compression')
const { Server } = require('socket.io');
const http = require('http');
var helmet=require('helmet')
var cors=require('cors')
// const jwt=require('jsonwebtoken');
// const {payloadType}=require('./constants/config');
const { Types } = require('mongoose'); // or import from Mongoose instance you're using
const Redis=require('./helper/Redis');
// const {setRedisData,getRedisData} =require('./helper/Redis')
var logger = require('morgan');
require('dotenv').config({
  path: '.env'
});

require('./db/connection'); // Ensure the database connection is established

var indexRouter = require('./routes/index');

const chatmodel=require('./db/chat/chat');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(helmet()); // Use Helmet for security best practices
app.use(compression()); // Enable compression for better performance
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
// const connectedUsers = new Map(); // Maps userId -> socket.id

// Attach Socket.IO to the server
const io = new Server(server, {
  cors: {
    origin: '*', // Set to your frontend URL in production
    methods: ['GET', 'POST']
  }
});

io.use((socket, next) => {
  const { userData, role ,token} = socket.handshake.auth;
  if (!userData || !role) 
    return next(new Error('Unauthorized'));
  socket.data.userData = userData;
  socket.data.role = role;
  socket.data.token=token;
  socket.data.userId = userData.userId || userData._id || userData.id;
  // console.log("userData--",userData);

  next();
});

io.on('connection', async (socket) => {
  const userId = socket.data?.userId;
  const role = socket.data?.role;

  if (!userId || !role) {
    console.warn("Socket connection missing userId or role. Disconnecting...");
    return socket.disconnect(true);
  }

  const redisKey = `socketId:${userId}`;
  console.log(`[CONNECTED] ${role} : ${userId} (Socket ID: ${socket.id})`);

  try {
    await Redis.setRedisData(redisKey, socket.id);
  } catch (err) {
    console.error(" Redis SET failed:", err);
  }

  // Handle typing event
  socket.on('typing', async ({ receiver }) => {
    console.log(" Typing event by:", userId, "→", receiver);
    if (!receiver) return;

    const receiverKey = `socketId:${receiver}`;
    try {
      const redisResult = await Redis.getRedisData(receiverKey);
      const receiverSocketId = redisResult?.data;

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', { sender: userId });
      } else {
        console.log(" No socket ID found for typing receiver:", receiver);
      }
    } catch (err) {
      console.error(" Redis GET failed for typing:", err);
    }
  });

  // Handle message event
  socket.on('send_message', async (msg) => {
    console.log("Incoming message:", msg);

    if (!msg?.sender || !msg?.receiver || !msg?.message) {
      return console.warn(" Incomplete message data:", msg);
    }

    try {
      const saveData = {
        userId: new Types.ObjectId(msg.sender),
        network_id: new Types.ObjectId(msg.receiver),
        name: msg.name,
        message: msg.message,
      };

      const chatMessage = new chatmodel(saveData);
      await chatMessage.save();

      const receiverKey = `socketId:${msg.receiver}`;
      const redisdata = await Redis.getRedisData(receiverKey);
      const receiverSocketId = redisdata?.data;

      console.log("receiverSocketId:", receiverSocketId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', {
          ...saveData,
          timestamp: new Date(),
        });
      } else {
        console.log(" No socket ID found for message receiver:", msg.receiver);
      }
    } catch (error) {
      console.error("Error saving or sending message:", error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log(`[DISCONNECTED] ${role} : ${userId}`);

    try {
      const redisResult = await Redis.getRedisData(redisKey);
      const storedId = redisResult?.data;

      if (storedId === socket.id) {
        await Redis.deleteRedisData(redisKey);
        console.log(` Redis key deleted for disconnected socket: ${redisKey}`);
      }
    } catch (err) {
      console.error(" Redis disconnect cleanup failed:", err);
    }
  });
});


app.use(indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {  /// error middleware 
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store');
//   next();
// });

// module.exports = app;
module.exports = { app, server };

