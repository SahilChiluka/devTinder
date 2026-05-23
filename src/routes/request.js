const express = require('express');

const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { validateConnectionRequestData } = require("../utils/validation");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
  try {
    validateConnectionRequestData(req);
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or : [
        {fromUserId, toUserId},
        {fromUserId : toUserId, toUserId : fromUserId}
      ]
    });
    if(existingConnectionRequest) {
      return res.status(400).json({message : "Connection Request Already Exists"});
    }

    const toUser = await User.findById(toUserId);
    if(!toUser) {
      return res.status(404).json({message : "User not found!"});
    }

    const request = new ConnectionRequest({
      fromUserId : fromUserId,
      toUserId : toUserId,
      status : status
    });

    const connectionRequestResult = await request.save();
    
    res.json({
      message : `${req.user.firstName} sent a connection request to ${toUser.firstName} with status ${status}`,
      data : connectionRequestResult
    });
  } catch (error) {
    console.error("Error in sending connection request: ", error);
    res.status(400).send("Something Went Wrong! " + error.message);
  }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)) {
      return res.status(404).json({message : "Request Status is Invalid!"});
    }

    const request = await ConnectionRequest.findOne({
      _id : requestId,
      toUserId : loggedInUser._id,
      status : "interested"
    });

    if(!request) {
      return res.status(404).json({message : "Connection Request Not Found!"});
    }

    request.status = status;

    const connectionRequestResult = await request.save();

    res.json({
      message : `${loggedInUser.firstName} has ${status} the connection request`,
      data : connectionRequestResult
    });
  } catch(error) {
    console.error("Error in reviewing connection request: ", error);
    res.status(400).json({error : "Something went wrong! " + error.message});
  }
});

module.exports = requestRouter

