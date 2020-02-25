'use strict'
const usersRouter = require('express').Router()
const userRouter = require('express').Router()

const UserController = require("../controllers/user.controller")

// Friends and Friend Request
userRouter.post("/:userId/sendFriendRequest", UserController.SEND_FRIEND_REQUEST)
userRouter.post("/:userId/acceptFriendRequest", UserController.ACCEPT_FRIEND_REQUEST)


exports.usersRouter = usersRouter
exports.userRouter = userRouter