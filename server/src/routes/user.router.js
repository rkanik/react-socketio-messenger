const usersRouter = require('express').Router()
const userRouter = require('express').Router()

const UserController = require("../controllers/user.controller")
const GroupController = require("../controllers/group.controller")
const { verifyToken } = require("../auth/auth.verifyToken")


usersRouter.get("/:userId", UserController.GET_USER)

// User's Groups
userRouter.get("/:userId/groupList", GroupController.GET_GROUPS_LIST)
userRouter.get("/:userId/group/:groupId", GroupController.GET_GROUP)

userRouter.route("/:userId/group/:groupId/messages")
   .post(GroupController.ADD_GROUP_MESSAGE)


exports.usersRouter = usersRouter
exports.userRouter = userRouter