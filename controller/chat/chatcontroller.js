const chatModel=require('../../db/chat/chat')
const Response=require('../../helper/Response')







exports.getUerChat = async (req, res) => {
    console.log("req.params-->",req.params)
  const userId = req.params.userId;
  const messages = await chatModel.find({$or: [{ sender: userId }, { receiver: userId }],}).sort({ timestamp: 1 });
   console.log("message--",messages)
  res.json(messages);
};

exports.getTopMost = async (req, res) => {
    try {
      console.log("hellowsss+++++++++++++++++++++++++++++++")
        const chatData = await chatModel.find().sort({ _id: -1 }).limit(10);
        console.log("chatData --", chatData);

        if (!chatData || chatData.length === 0) {
            const response = Response.error();
            response.msg = 'No chat data found';
            return res.status(200).json(response);
        }

        const response = Response.success();
        response.payload = chatData;
        response.payloadType = payloadType.array;
        response.msg = "Success";
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error in getTopMost:", error);

        const response = Response.error();
        response.msg = 'Something went wrong on the server side';
        return res.status(500).json(response);
    }
};

