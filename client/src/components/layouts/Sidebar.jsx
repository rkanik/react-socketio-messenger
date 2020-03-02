import React from 'react';

// Components
//import MessagesList from "../messages-list/messages-list"
import CoversationsList from "../Messages/ConversationsList"
import BottomNavbar from "../bottomNavbar/bottomNavbar"

const Sidebar = ({ user, conversations }) => {
   return (
      <div className="sidebar pos-rel d-flex fd-col">
         <div className="px-5 py-4 d-flex">
            <img className="thumbnail circle" src={user && user.thumbnail ? user.thumbnail : ""} alt="" />
            <div className="ml-5 mw-max">
               <h3 className="font-normal">{user && user.name}</h3>
               <p className="username">{user && user.email}</p>
            </div>
            <div className="spacer"></div>
            <div className="actions mw-max">
               <i className="pos-rel circle fal fa-plus mr-2" />
               <i className="pos-rel circle fas fa-cog" />
            </div>
         </div>
         <div className="px-5 pt-2 pb-5">
            <div className="search pos-rel">
               <input className="px-5 w-100" type="text" placeholder="Search" />
               <i className="pos-abs far fa-search"></i>
            </div>
         </div>
         {/* <MessagesList items={items} userId={user._id} activeItem={activeConversation} /> */}
         <CoversationsList items={conversations} />
         <BottomNavbar />
      </div>
   );
}

export default Sidebar;