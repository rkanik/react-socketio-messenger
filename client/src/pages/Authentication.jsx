import React, { useState } from 'react';

// Svg assets
import AccessAccount from "../assets/svg/access_account.svg"
import ForgotPassword from "../assets/svg/forgot_password.svg"
import WelcomeCats from "../assets/svg/welcome_cats.svg"

// Components
import Login from "../components/Authentication/Login"
import Register from "../components/Authentication/Register"
import ResetPassword from "../components/Authentication/ResetPassword"
import Button from "../components/custom/Button/Button"
import { CircularProgress } from "@material-ui/core"

const LOGIN = 'LOGIN', REGISTER = 'REGISTER', FORGOT_PASS = "FORGOT_PASS"

const Authentication = () => {

   const [active, setActive] = useState(LOGIN)
   const [loading, setLoading] = useState(false)

   const handleActiveChange = val => {
      setLoading(true)
      setTimeout(() => {
         setActive(val)
         setLoading(false)
      }, 500)
   }

   return (
      <div className='authenticate w-100 h-100 pos-rel'>
         <div className="inner-card d-flex fd-row to-center elevation-1 rounded">
            <div className="content d-flex fd-col text-center w-100 pa-10">
               <div className="spacer-y"></div>
               <h3 className='font-normal txt-sec'>Welcome to</h3>
               <h1 className='mt-2 font-normal mb-10'>Messenger</h1>
               <div className='mt-5'>
                  {active === LOGIN && <img className='mobile-login' src={WelcomeCats} alt="" />}
                  {active === REGISTER && <img className='mobile-login' src={AccessAccount} alt="" />}
                  {active === FORGOT_PASS && < img className='mobile-login' src={ForgotPassword} alt="" />}
               </div>
               <div className="spacer-y"></div>
               <div className='con-with pos-rel mb-8'>
                  <hr className='mx-auto' />
                  <p className='to-center py-1 px-5'>Continue with</p>
               </div>
               <div className='mb-5'>
                  <Button pill outlined icon color='orange'>
                     <i className="fab fa-google mr-3 fa-sm"></i>
                     <span>Google</span>
                  </Button>
               </div>
            </div>
            <div className='forms w-100 px-10 py-5'>
               {active === LOGIN && <Login
                  onActiveChange={handleActiveChange}
                  onForgotPass={() => handleActiveChange(FORGOT_PASS)}
               />}
               {active === REGISTER && <Register onActiveChange={handleActiveChange} />}
               {active === FORGOT_PASS && <ResetPassword onActiveChange={handleActiveChange} />}
            </div>
            {
               loading && <div className="overlay wh-100 pos-abs">
                  <div className='to-center'><CircularProgress color='secondary' /></div>
               </div>
            }
         </div>
      </div >
   );
}

export default Authentication;