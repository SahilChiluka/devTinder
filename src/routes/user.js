const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const recievedRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ]);

    if (recievedRequests.length == 0) {
      return res.status(200).json({ message: "No pending Requests Found!" });
    }

    res.status(200).json({
      message: "All Requests Send Successfully",
      data: recievedRequests,
    });
  } catch (error) {
    res.status(404).send("Error: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const dataToSend = "firstName lastName age gender photoUrl about skills";

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", dataToSend)
      .populate("toUserId", dataToSend);
    if (connectionRequests.length == 0) {
      res.status(400).json({ message: "No Connection Requests Found!" });
    }
    const data = connectionRequests.map((request) => {
      if (request.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return request.toUserId;
      }
      return request.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    res.status(400).json({
      "Error: ": error.message,
    });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const hideUsersFromFeed = new Set();

    // Hide users who have sent or received connection requests to/from logged in user
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });

    hideUsersFromFeed.add(loggedInUser._id.toString()); // Hide logged in user from feed

    const userFeed = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select("firstName lastName age gender photoUrl about skills")
      .skip(skip)
      .limit(limit);

    if (userFeed.length == 0) {
      return res.status(200).json({ message: "No Users Found!" });
    }

    res
      .status(200)
      .json({ message: "User Feed Fetched Successfully!", data: userFeed });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = userRouter;
