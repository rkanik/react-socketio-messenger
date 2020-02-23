const router = require('express').Router()
const UserController = require("../controllers/user.controller")
const GroupController = require("../controllers/group.controller")
const { verifyToken } = require("../auth/auth.verifyToken")

router.get("/", verifyToken, UserController.getUser)

// User's Groups
router.get("/:userId/groupList", GroupController.GET_GROUPS_LIST)

module.exports = router