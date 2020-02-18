import React from 'react';
import "./sidebar.scss"

// Components
import MessagesList from "../../components/messages-list/messages-list"

const Sidebar = ({ items, user, setState, activeConversation }) => {
   return (
      <div className="sidebar pos-rel">
         <div className="px-5 py-4 d-flex">
            <img className="thumbnail circle" src={user && user.thumbnail ? user.thumbnail : ""} alt="" />
            <div className="ml-5 mw-max">
               <h3 className="font-normal">{user && user.name}</h3>
               <p className="username">{user && user.userName}</p>
            </div>
            <div className="spacer"></div>
            <div className="actions mw-max">
               <i onClick={() => setState({ createGroup: true })} className="pos-rel circle fal fa-plus mr-2" />
               <i className="pos-rel circle fas fa-cog" />
            </div>
         </div>
         <div className="px-5 py-2">
            <div className="search">
               <input className="px-5 w-100" type="text" placeholder="Search" />
            </div>
         </div>
         <MessagesList items={items} userId={user._id} activeItem={activeConversation} />
      </div>
   );
}

export default Sidebar;
