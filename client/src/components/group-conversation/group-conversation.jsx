import React, { useState, useEffect } from "react"
import { Api } from "../../axios/configs.axios"
import io from "socket.io-client"

import "./group-conversation.scss"

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
            setMessages([...messages, data])
         }
      })
      scrollToBottom()
   }, [messages])

   // Methods
   const fetchGroup = async () => {
      try {
         let group = (await Api.get("/group/" + _id)).data
         setGroup(group)
         setMessages(group.messages)
      }
      catch (error) { console.log(error) }
   }
   const handleChange = ({ target: { value } }) => { setMessage(value) }
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
                     {messages.map(({ _id, message, sendBy, sentAt }) => (
                        <div className='d-flex w-100 my-2' key={_id}>
                           {sendBy === user._id && <div className="spacer"></div>}
                           <p style={{ fontSize: '0.8em' }} className='mw-max mr-3 mt-2'>{`${new Date(sentAt).toLocaleTimeString()}`}</p>
                           {sendBy === user._id
                              ? <p className='message px-4 py-2 bg-blue text-white mr-5'>{message}</p>
                              : <p className='message px-4 py-2 bg-grey'>{message}</p>
                           }
                        </div>
                     ))}
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
            <div className='right-sidebar'></div>

            {/* <div className='members-list pa-5 ma-5'>
               {group.members && group.members.map(member => (
                  <div className='item d-flex mb-3' key={member._id}>
                     <div className='char-thumb pos-rel'>
                        <p className='pos-abs to-center'>{member.role}</p>
                     </div>
                     <p className="ml-3">{member.name}</p>
                  </div>
               ))}
            </div> */}
         </div>
      </div>
   )
}

export default Conversation