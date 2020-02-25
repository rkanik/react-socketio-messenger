const groupsRouter = require("express").Router()
const groupRouter = require("express").Router()
const Group = require("../models/groups.model")
const User = require("../models/users.model")

// Controllers
const GroupController = require("../controllers/group.controller")

groupsRouter.route("/")
   .get(GroupController.GET_GROUPS)
   .post(GroupController.CREATE_GROUP)
   .delete(GroupController.DELETE_GROUPS)

groupsRouter.get("/groupList", GroupController.GET_GROUPS_LIST)

groupRouter.route("/:groupId")
   .get(GroupController.GET_GROUP)
   .patch(GroupController.UPDATE_GROUP)
   .delete(GroupController.DELETE_GROUP)

groupRouter.route("/:groupId/members")
   .get(GroupController.GET_GROUP_MEMBERS)
   .post(GroupController.ADD_GROUP_MEMBER)

groupRouter.route("/:groupId/member/:userId")
   .patch(GroupController.UPDATE_GROUP_MEMBER)
   .delete(GroupController.DELETE_GROUP_MEMBER)

groupRouter.route("/:groupId/messages")
   .get(GroupController.GET_GROUP_MESSAGES)
   .post(GroupController.ADD_GROUP_MESSAGE)

groupRouter.route("/:groupId/message/:msgId")
   .delete(GroupController.DELETE_GROUP_MESSAGE)

groupRouter.route("/:_id")
   .get(async (req, res) => {
      try {
         let withUserDetails = req.query.with_user || null
         let group = await Group.findById(req.params._id, { messages: { $slice: -20 }, __v: 0 })
         group = group._doc
         if (withUserDetails && group) {
            group.members = await Promise.all(group.members.map(async member => {
               member = member._doc
               let user = await User.findById(member._id).select("userName thumbnail")
               return { ...member, ...user._doc }
            }))
         }
         if (group) res.json(group)
         else res.status(404).json({ error: true, message: "There is no group with the id." })
      }
      catch (error) { res.status(500).json({ error: true, message: error.message }) }
   })

groupRouter.get("/:_id/messages/:length", async (req, res) => {
   try {
      let group = (await Group.findById(
         req.params._id, { messages: { $slice: -req.params.length }, __v: 0 }
      ))
      res.json(group.messages)
   }
   catch (error) { res.status(500).json({ error: true, message: error.message }) }
})

module.exports = { groupsRouter, groupRouter }