const socketio = require("socket.io")
const { getGroup } = require("../controllers/socket/group/group.socket.cont")
const { Group } = require("../models")

const wait = () => new Promise((res) => { setTimeout(() => { res() }, 1000) })

module.exports = server => {

   const io = socketio(server)
   io.on('connection', client => {

      console.log("Connected => ", new Date().toLocaleTimeString())

      client.on('disconnect', () => {
         console.log("Disconnected => ", new Date().toLocaleTimeString())
      })

      client.on("join", async ({ group, name }, callback) => {
         client.emit("message", { message: `${name} has joined` })
         client.broadcast.to(group).emit("message", `${name} has joined`)
         client.join(group)
         callback({ error: false, joined: true })
      })

      client.on("sendSessage", async ({ group, ...message }, callback) => {
         io.to(group).emit("message", { _id: group, ...message })

         let res = await Group.updateOne({ _id: group }, { $push: { messages: { ...message } } })

         callback({ error: false, message: res })
      })
   })
}