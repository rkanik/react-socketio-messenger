'use strict';

const Router = require('express').Router
const chatsRouter = Router()
const chatRouter = Router()
const chatsController = require("../controllers/chat.controller")

chatsRouter.route("/")
   //.get(getChats)
   .post(chatsController.CREATE_CHAT)

chatsRouter.route("/list")
//.get(getChatsList)

chatRouter.route("/:frndId")
// .get(getChat)
// .patch(updateChat)
// .delete(deleteChat)

chatRouter.route("/:frndId/message")
   .post(chatsController)

module.exports = chatsRouter
module.exports = chatRouter