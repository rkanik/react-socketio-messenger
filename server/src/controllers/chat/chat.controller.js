// Models
const { Group, GroupMember } = require("../../models/")

exports.getGroups = (req, res) => {
   
}

exports.createGroup = (req, res) => {
   let group = new Group(req.body)
   let validationError = group.validateSync()
   if (!validationError) {
      group.save({}, (err, doc) => {
         if (err) res.status(500).json(err)
         else res.json(doc)
      })
   }
   else res.send(validationError)
}

exports.addMember = (req, res) => {
   let member = new GroupMember(req.body.member)
   let validationError = member.validateSync()
   if (!validationError) {
      Group.updateOne(
         { _id: req.body._id },
         { $push: { members: member } },
         (err, doc) => {
            if (err) res.json(err)
            else res.json(doc)
         }
      )
   }
   else res.json(validationError)
}