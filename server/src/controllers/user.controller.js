'use strict'
// Models
const Users = require("../models/users.model")

// Schema
const ObjectId = require("mongoose").Types.ObjectId
const FriendRequest = require("../models/joi/friendRequest")
const Friend = require("../models/joi/friend.joi")

// Error handlers
const { CError } = require("../helpers/error")

// Status codes
const {  BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("../helpers/http.status")

// Request Handlers
const { REQUEST_HANDLER } = require("./request.handler")
const { createChat } = require("./chat.controller")


const getUser = userId => {
   return { data: { userId, msg: "I am here get user" } }
}

const addFriendRequest = async (userId, request) => {
   try {
      // Checking userId and frined's userId
      if (!ObjectId.isValid(userId) || !ObjectId.isValid(request && request.userId))
         throw new CError(BAD_REQUEST, 'UserId or FriendId is not a valid ObjectId')

      // Checking if friend data is valid
      let { error } = FriendRequest.validate(request)
      if (error) throw new CError(BAD_REQUEST, error.message)
      // Pushing friend request
      let resp = await Users.updateOne(
         { _id: userId },
         { $push: { friendRequests: request } }
      )
      // If request not pushed
      if (resp.nModified === 0)
         throw new CError(INTERNAL_SERVER_ERROR, "Error pushing friend request")
      // returning
      return { data: resp }
   }
   catch (err) { return { error: true, errorCode: err.errorCode, message: err.message } }
}

const acceptFriendRequest = async (userId, request) => {
   try {
      // Checking userId and frined's userId
      if (!ObjectId.isValid(userId) || !ObjectId.isValid(request.userId))
         throw new CError(BAD_REQUEST, 'UserId or FriendId is not a valid ObjectId')

      let { error } = Friend.validate(request)
      if (error) throw new CError(BAD_REQUEST, "Friend validation failed")

      let resp = await Users.updateOne({ _id: userId }, { $push: { friends: request } })
      if (resp.nModified === 0) throw new CError(INTERNAL_SERVER_ERROR, "Error while accepting friend request")

      let pulled = await Users.updateOne({ _id: userId }, { $pull: { friendRequests: { userId: request.userId } } })

      if (pulled.nModified === 0) {
         await Users.updateOne({ _id: userId }, { $pull: { friends: { userId: request.userId } } })
         throw new CError(BAD_REQUEST, "Friend request not available in the request list")
      }

      // Creating chat
      let chatRes = await createChat(userId, request.userId, { createdAt: request.addedAt })
      if (chatRes.error) throw new CError(chatRes.errorCode, chatRes.message)

      return { data: resp }

   }
   catch (err) { return { error: true, errorCode: err.errorCode, message: err.message } }
}

// GET REQUESTS
exports.GET_USER = ({ params: { userId } }, res, nxt) => {
   REQUEST_HANDLER(res, nxt, getUser, [userId])
}

exports.SEND_FRIEND_REQUEST = ({ params: { userId }, body }, res, next) => {
   REQUEST_HANDLER(res, next, addFriendRequest, [userId, body])
}

exports.ACCEPT_FRIEND_REQUEST = ({ params: { userId }, body }, res, next) => {
   REQUEST_HANDLER(res, next, acceptFriendRequest, [userId, body])
}