import React from 'react';
import { useHistory } from "react-router-dom"
import "./messages-list.scss"

const MessagesList = ({ items }) => {
   console.log("MessagesList", items);
   const history = useHistory()
   return (
      <div className='messages-list text-white pt-5'>{
         items.map(({ _id, name, thumbnail, ...rest }) => (
            <div onClick={() => history.push(`/messages/g/${_id}`)} className="list-item d-flex pa-3" key={_id}>
               <img src={thumbnail} alt={thumbnail} />
               <div className='pl-5'>
                  <p>{name}</p>
               </div>
            </div>
         ))
      }</div>
   )
}

export default MessagesList;
