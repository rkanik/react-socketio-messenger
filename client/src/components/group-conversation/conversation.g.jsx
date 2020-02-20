import React, { useState, useEffect } from "react"
import { Api } from "../../axios/configs.axios"
import io from "socket.io-client"

import "./_conversation.g.scss"

// Components
import Messages from "./messages.g"
import RightBar from "../rightbar/rightbar"

// Socket
var client

const Conversation = ({ match: { params: { _id } }, user, ...rest }) => {

   const [group, setGroup] = useState({})
   const [message, setMessage] = useState("")
   const [messages, setMessages] = useState([])

   useEffect(() => {
      console.log("USER_ID =>", user._id);
      rest.activeConversation(_id)
      fetchGroup()
      console.log("GC - A");
      client = io.connect("http://localhost:3875/")
      client.emit("join", { group: _id, name: user.name }, res => {
         console.log("JOIN => ", res);
      })
      return () => {
         client.disconnect()
         client.off()
      }
   }, [_id])

   useEffect(() => {
      console.log("GC - B");
      client.on('message', data => {
         if (data.sendBy && (data.sendBy !== user._id)) {
            data = { ...data, ...userDetails(data.sendBy) }
            setMessages([...messages, data])
         }
      })
      scrollToBottom()
   }, [messages])

   // Methods
   const handleChange = ({ target: { value } }) => { setMessage(value) }
   const fetchGroup = async () => {
      console.log("fetchGroup");
      try {
         let group = (await Api.get(`/group/${_id}?with_user=true`)).data
         setGroup(group)
         let currentSendBy = null
         group.messages = group.messages.map(message => {
            if (message.sendBy === user._id) currentSendBy = null
            if (message.sendBy === user._id || currentSendBy === message.sendBy) return message
            let member = group.members.find(member => member._id === message.sendBy)
            currentSendBy = message.sendBy
            return member ? {
               ...message,
               userName: member.userName,
               thumbnail: member.thumbnail
            } : message
         })
         setMessages(group.messages)
      }
      catch (error) { console.log(error) }
   }
   const handleKeyPress = async e => {
      if (e.key === "Enter") {
         if (message.trim() !== "") {
            let data = {
               group: _id,
               message: message,
               sendBy: user._id,
               sentAt: Date.now()
            }
            setMessages([...messages, data])
            setMessage('')
            client.emit("sendSessage", data, res => {
               console.log(res)
            })
         }
         else setMessage('')
      }
   }
   const scrollToBottom = id => {
      var div = document.getElementById(id || 'scroll-to-bottom');
      let toScroll = div.scrollHeight - div.scrollTop
      div.scrollTop = toScroll <= 1500 ? div.scrollHeight - div.clientHeight : div.scrollTop
   }
   const handleScroll = ({ target }) => {
      if (target.scrollTop == 0) {
         console.log("fetch more message")
      }
   }
   const userDetails = id => {
      console.log(id)
      let user = id && group.members ? group.members.find(user => user._id === id) : null
      console.log(user)
      return user ? { userName: user.userName, thumbnail: user.thumbnail } : {}
   }

   return (
      <div className='group-conversation w-100 d-flex fd-col'>
         <div className='toolbar'>
            <div className='px-10 py-3 d-flex'>
               <img className="circle mt-1" src={group.thumbnail} alt="" />
               <h2 className='group-name font-normal ml-5 mt-2'>{group.name}</h2>
            </div>
         </div>
         <div className='gc-wrapper d-flex'>
            <div className='w-100 d-flex fd-col'>
               <div className=' h-100p conversation overflow-hidden'>
                  <div id='scroll-to-bottom' onScroll={handleScroll} className="hidden-scrollbar pl-5">
                     <Messages messages={messages} userId={user._id} />
                  </div>
               </div>
               <div className='bottom-message-bar px-5 py-4'>
                  <input
                     onChange={handleChange}
                     onKeyPress={handleKeyPress}
                     value={message}
                     className="w-100 px-6 py-3"
                     type="text"
                     placeholder="Write your message"
                  />
               </div>
            </div>
            <div className='logger'></div>
            <RightBar />
         </div>
      </div>
   )
}

export default Conversation