
const Group = require("../models/groups.model")
const User = require("../models/users.model")

exports.getUser = async (req, res) => {

   if (!req.body._id) return req.status(400).json({ error: true, message: "There is no object id in body" })

   let user = await User.findById(req.body._id).select("name userName email thumbnail")

   if (user) return res.status(200).json(user)

   res.status(404).json({ error: true, message: "There is no user with this id" })
}

exports.getGroups = async (req, res) => {
   let projection = {}
   req.query.select && req.query.select.split(',').forEach(s => { projection[s] = 1 })
   try {
      let groups = await Group.find(
         { 'members._id': req.params._id },
         { ...projection, messages: { $slice: -1 } }
      )
      res.json(groups)
   } catch (error) { res.status(500).json({ error: true, message: "Error fetching groups" }) }
}
