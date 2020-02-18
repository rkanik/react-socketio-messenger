import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom"
import "./messages-list.scss"

const MessagesList = ({ items, userId, activeItem }) => {

   const [state, setState] = useState({
      history: useHistory()
   })

   // Methods
   const onClickListItem = id => {
      state.history.replace(`/messages/g/${id}`)
   }

   return (
      <div className='messages-list w-100 text-white pt-5'>{
         items.map(({ _id, name, thumbnail, messages }) => (
            <div
               onClick={() => onClickListItem(_id)}
               className={`list-item d-flex px-5 py-3 ${activeItem === _id && 'active'}`}
               key={_id}
            >
               <img src={thumbnail} alt={thumbnail} />
               <div className='pl-5 pt-1 w-100'>
                  <div className='d-flex mb-1'>
                     <p className='title mw-max'>{name}</p>
                     <div className="spacer"></div>
                     <p className="time mw-max mt-1">{messages.length > 0 && new Date(messages[0].sentAt).toLocaleTimeString()}</p>
                  </div>
                  <div>{
                     messages.length > 0
                        && messages[0].sendBy === userId
                        ? <p className='message'>You: {messages[0].message.substring(0, 24)}...</p>
                        : <p className='message'>{messages[0].message.substring(0, 24)}...</p>
                  }
                  </div>
               </div>
            </div>
         ))
      }</div>
   )
}

export default MessagesList;
