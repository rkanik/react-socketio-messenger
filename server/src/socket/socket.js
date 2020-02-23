const socketio = require("socket.io")
//const { getGroup } = require("../controllers/socket/group/group.socket.cont")
const Groups = require("../models/groups.model")

//const wait = () => new Promise((res) => { setTimeout(() => { res() }, 1000) })

module.exports = server => {

   const io = socketio(server)
   io.on('connection', client => {

      console.log("---------------------------------")
      console.log("Connected => ", client.id, new Date().toLocaleTimeString())
      console.log(client.connected)
      console.log(client.disconnected)
      console.log(client.client.id)
      console.log("---------------------------------")


      client.emit('connected', {
         clientId: client.id
      })

      client.on('disconnect', () => {
         console.log("Disconnected => ", new Date().toLocaleTimeString())
      })

      client.on("join", async ({ group, name, id }, callback) => {
         client.join(group)
         client.broadcast.to(group).emit("join", { message: `${name} has joined`, id })
         callback({ error: false, joined: true })
      })

      client.on("sendSessage", async ({ group, ...message }, callback) => {
         io.to(group).emit("message", { _id: group, ...message })
         let res = await Groups.updateOne({ _id: group }, { $push: { messages: { ...message } } })
         callback({ error: false, message: res })
      })
   })
}