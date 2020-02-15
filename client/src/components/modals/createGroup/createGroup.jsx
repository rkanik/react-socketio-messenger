import React from 'react';
import "./createGroup.scss"
const CreateGroup = ({ setState }) => {
   return (
      <div className="overlay pos-fxd w-100 h-100">
         <div className='create-group pos-abs to-center rounded'>
            <i onClick={() => setState({ createGroup: false })} className="close fal fa-times pos-abs top-1 right-2 pointer"></i>
            <div className="pa-5 pos-rel">
               <div className="group-image pos-rel mx-auto">
                  <div className="inner-overlay circle pos-abs w-100 h-100p">
                     <i className="fal fa-camera fa-lg pos-abs to-center text-white"></i>
                  </div>
                  <img className="w-100 h-100p circle" src="https://i.ibb.co/WWbGCkf/gallery.png" />
               </div>
            </div>
            <div className="text-center px-10 pb-5 mb-8">
               <input className="group-name px-8 py-4 w-100" type="text" placeholder="Enter group name" />
            </div>
            <div className="actions px-5 pb-5 mb-5">
               <button className="done mx-auto d-block px-5 py-3 pointer">create group</button>
            </div>
            {/* <hr className="divider light" />
            <div className="text-center pa-5">
               add friend
            </div> */}
         </div>
      </div>
   );
}

export default CreateGroup;
