const router = require("express").Router()
const { Group, User } = require("../../models")

router.route("/:_id")
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

router.get("/:_id/messages/:length", async (req, res) => {
   try {
      let group = (await Group.findById(
         req.params._id, { messages: { $slice: -req.params.length }, __v: 0 }
      ))
      res.json(group.messages)
   }
   catch (error) { res.status(500).json({ error: true, message: error.message }) }
})

module.exports = router