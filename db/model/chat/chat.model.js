const Mongoose = require("mongoose");
const objectId=Mongoose.Schema.Types.ObjectId

const chatSchema = Mongoose.Schema(
  {
    network_id:{
      type:objectId,
      required:true
    },
    sender: {
      type: String,
    },
    receiver: {
      type: String,
    },
    userId:{
        type:objectId,
        required:true
    },
    name:{
      type:String,
    },
    email:{
        type:String
    },
    message: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = chatSchema;
