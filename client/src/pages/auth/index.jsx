import React, { useEffect } from 'react';
import auth from "../../auth/auth"

const Auth = ({ history }) => {
   useEffect(() => {
      auth.isAuth
         ? history.replace("/messages")
         : history.replace("/auth/login")
   })
   return <></>
}
export default Auth;
