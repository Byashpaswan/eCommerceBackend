var amqplib=require('amqplib');
const axos=require('axios');

var pubChannel = null;
var amqpConn = null;
var connection = null;

exports.start=async()=>{
   return new Promise((resolve,reject)=>{
    if(connection){
        console.log("RabbitMQ connection already established");
        resolve(connection);
    }
    else{
        amqpConn= amqplib.connect(process.env.RABBITMQ_URL + "?heartbeat=60");
        amqpConn.then(conn => {
                if(!conn){
                    reject(new Error("Failed to connect to RabbitMQ"));
                }
                conn.on("error", (err) => {
                    console.error("RabbitMQ connection error:", err);
                    reject(err);
                });
                conn.on("close", () => {
                    console.error("RabbitMQ connection closed");
                    reject(null);
                });

                connection = conn;
                console.log("RabbitMQ connection established");
                resolve(connection);
            }).catch(err => {
                console.error("Error connecting to RabbitMQ:", err);
                reject(err);
            });
       }
    })
}

exports.createChannel=async()=>{
//    try{
//      amqpConn.createChannel().then(channel => {
//         if (!channel) {
//             throw new Error("Failed to create RabbitMQ channel");
//         }
//         pubChannel = channel;
//         pubChannel.on("error", (err) => {
//             console.error("RabbitMQ channel error:", err);
//         });
//         pubChannel.on("close", () => {
//             console.error("RabbitMQ channel closed");
//             pubChannel = null;
//         });
//         console.log("RabbitMQ channel created successfully");
//      }).catch(err => {
//          console.error("Error creating RabbitMQ channel:", err);
//          throw err;
//      });

     return new Promise((resolve,reject)=>{
       amqpConn.createChannel().then(channel => {
           if (!channel) {
               resolve(false);
           }
           pubChannel = channel;
           pubChannel.on("error", (err) => {
               console.error("RabbitMQ channel error:", err);
               resolve(false);
           });
           pubChannel.on("close",async () => {
               console.error("RabbitMQ channel closed");
               amqpConn=await this.start();
               resolve(false);
           });
           console.log("RabbitMQ channel created successfully");
           resolve(pubChannel);
       }).catch(err => {
           console.error("Error creating RabbitMQ channel:", err);
          resolve(false);
       });
     })
   }



exports.publish=async(queue, message)=>{
  try {
    if (!pubChannel) {
      throw new Error("Publisher channel is not initialized");
    }
    await pubChannel.assertQueue(queue, { durable: true });
    pubChannel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Message sent to queue ${queue}:`, message);
  } catch (error) {
    console.error("Error publishing message:", error);
  } 
}