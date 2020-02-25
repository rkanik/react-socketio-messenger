
const Chats = require("../models/chats.model")
const { REQUEST_HANDLER } = require("../controllers/request.handler")

const { INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_MODIFIED } = require("../helpers/http.status")

const ObjectId = require('mongoose').Types.ObjectId

const Message = require("../models/joi/message.joi")

// Create chat
const createChat = async (userId, frndId, { createdAt }) => {
   if (!ObjectId.isValid(userId) || !ObjectId.isValid(frndId)) {
      return {
         error: true,
         errorCode: BAD_REQUEST,
         message: "UserId or FriendId is not a valid ObjectId"
      }
   }
   try {
      let chat = new Chats({ users: [userId, frndId], messages: [], createdAt })
      let validationError = chat.validateSync()
      if (validationError) {
         return {
            error: true,
            errorCode: BAD_REQUEST,
            messages: "Chat validation failed"
         }
      }
      let savedChat = await chat.save()
      return { data: savedChat }
   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}

const pushChatMessage = async (userId, frndId, message) => {
   if (!ObjectId.isValid(userId) || !ObjectId.isValid(frndId)) {
      return {
         error: true,
         errorCode: BAD_REQUEST,
         message: "UserId or FriendId is not a valid ObjectId"
      }
   }
   try {

      let { error } = Message.validate(message)
      if (error) return {
         error: true,
         errorCode: BAD_REQUEST,
         message: error.message
      }

      let pushResp = await Chats.updateOne(
         { users: { $all: [userId, frndId] } },
         { $push: { messages: message } }
      )

      if (pushResp.nModified === 0) return {
         error: true,
         errorCode: BAD_REQUEST,
         message: "Message not pushed"
      }

      return { data: pushResp }

   }
   catch (error) {
      return {
         error: true,
         errorCode: INTERNAL_SERVER_ERROR,
         message: error.message
      }
   }
}


// Exports
exports.createChat = createChat

// POST REQUESTS
exports.CREATE_CHAT = ({ params: { userId, frndId }, body }, res, next) => {
   REQUEST_HANDLER(res, next, createChat, [userId, frndId, body])
}

exports.PUSH_CHAT_MESSAGE = async ({ params: { userId, frndId }, body }, res, next) => {
   REQUEST_HANDLER(res, next, pushChatMessage, [userId, frndId, body])
}