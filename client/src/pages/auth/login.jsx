import React, { useEffect, useState } from 'react';
import auth from "../../auth/auth"
import queryString from 'query-string'

const Login = ({ history: { replace } }) => {
   useEffect(() => {
      let token = queryString.parse(window.location.search).token || localStorage.getItem("token")
      if (token) {
         //replace("/messages")
         localStorage.setItem("access-token", token)
         console.log(token);
      } else {
         console.log("No token");
      }
   }, [replace])
   const [isAuth] = useState(auth.isAuth)
   useEffect(() => { isAuth && replace("/messages") })
   return (
      <div className='w-100 h-100 pos-rel'>
         <div className="card outlined pos-abs to-center">
            <h1 className="font-normal">Login</h1>
            <a href="http://localhost:3875/auth/google"><button>Google</button></a>
         </div>
      </div>
   );
}

export default Login;
