const router = require('express').Router()
const { user } = require("../../controllers")
const { verifyToken } = require("../../auth/auth.verifyToken")

router.get("/", verifyToken, user.getUser)

router.route("/:_id/groups")
   .get(user.getGroups)

module.exports = router