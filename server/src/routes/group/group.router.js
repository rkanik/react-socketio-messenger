const router = require("express").Router()
const { Group } = require("../../models")

router.route("/:_id")
   .get(async (req, res) => {
      try {
         let group = await Group.findById(req.params._id, { messages: { $slice: -20 }, __v: 0 })
         // for (let message of group.messages) {
         //    console.log(message)
         // }
         if (group) res.json(group)
      }
      catch (error) { res.status(500).json({ error: true, message: error.message }) }
   })

module.exports = router