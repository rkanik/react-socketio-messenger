import React, { useState } from 'react';
import "./bottomNavbar.scss"

const BottomNavbar = () => {

   const [active, setActive] = useState("CHATS")

   return (
      <div className='tab-switcher d-flex pa-5'>
         <div
            className={`${active === 'CHATS' && 'active'}
            switcher pointer w-100 text-center`}
            onClick={() => setActive("CHATS")}
         >
            <i className="fas fa-comments" />
         </div>
         <div
            className={`${active === 'FRIENDS' && 'active'}
            switcher w-100 text-center`}
            onClick={() => setActive("FRIENDS")}
         >

            <i className="fal pointer fa-user-friends" />
         </div>
         <div
            className={`${active === 'GROUPS' && 'active'}
            switcher w-100 text-center`}
            onClick={() => setActive("GROUPS")}
         >
            <i className="fal pointer fa-users" />
         </div>
      </div>
   );
}

export default BottomNavbar;