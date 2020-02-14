const router = require("express").Router()

const { createGroup, addMember } = require("../../controllers/chat/chat.controller")

router.route("/group")
   .post(createGroup)

router.route("/group/member")
   .post(addMember)

module.exports = router