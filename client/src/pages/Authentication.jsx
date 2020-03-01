import React, { useState, useContext, useEffect } from 'react';
import { AuthContext, initState } from "../context/AuthContext"

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

const Authentication = ({ history }) => {

   const [active, setActive] = useState('')
   const [loading, setLoading] = useState(false)

   const {
      socket, isAuth, currentUser, accessToken,
      setState, setToken, resetState
   } = useContext(AuthContext)

   console.log(isAuth, currentUser, accessToken);

   useEffect(() => {
      if (accessToken && socket) {
         socket.emit("loginWithToken", accessToken, res => {
            console.log("||--loginWithToken--||", res);
            if (!res.error) { onLogin(res) }
         })
      }
   }, [accessToken, socket])

   useEffect(() => {
      if (socket) {
         console.log(socket);
      }
   }, [socket])

   useEffect(() => {
      isAuth && history.push("/messages")
   }, [isAuth])

   // Sync active to local storage
   useEffect(() => { active && localStorage.setItem('authActive', active) }, [active])
   useEffect(() => {
      let a = localStorage.getItem('authActive'); setActive((a && a !== '') ? a : LOGIN)
   }, [])

   const handleLogin = ({ email, password }) => {
      console.log("||--handleLogin--||");
      socket.emit("login", { email, password }, res => {
         if (!res.error) { onLogin(res.user, res.token) }
         else { resetState(initState) }
      })
   }

   const onLogin = (user, token) => {
      console.log("||--onLogin--||");
      token && setToken(token)
      setState({ currentUser: user, isAuth: true })
      setLoading(false); history.push("/messages")
   }

   const handleActiveChange = val => {
      console.log("||--handleActiveChange--||");
      setLoading(true)
      setTimeout(() => {
         setActive(val)
         setLoading(false)
      }, 300)
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
                  handleLoading={v => setLoading(v)}
                  onLogin={v => handleLogin(v)}
                  history={history}
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