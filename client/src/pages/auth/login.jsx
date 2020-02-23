import React, { useEffect, useState } from 'react';
import queryString from 'query-string'
import logo from "../../assets/images/logo_64.png"
import "./scss/login.scss"
import { CircularProgress } from "@material-ui/core"
import { Api } from "../../axios/configs.axios"

const Login = ({ history: { replace } }) => {

   // States
   const [state, setState] = useState({
      userName: "",
      password: "",
      loading: false,
   })

   // Effects
   useEffect(() => { initialize() })


   const wait = () => new Promise(r => { setTimeout(() => { r() }, 1000) })

   // Methods
   const initialize = async () => {
      setState({ ...state, loading: true })
      let token = queryString.parse(window.location.search).token || localStorage.getItem("access-token")
      if (token) {
         try {
            let valid = await (await Api.get("/token/" + token + "/valid")).data
            await wait()
            if (valid) {
               localStorage.setItem("access-token", token)
               replace("/messages")
            }
            else setState({ ...state, loading: false })
         }
         catch (_) { setState({ ...state, loading: false }) }
      }
      else setState({ ...state, loading: false })
   }

   const handleInputChange = ({ target: { name, value } }) => setState({ ...state, [name]: value })

   const loginUser = () => {
      if (state.userName.trim() !== "" && state.password.trim() !== "") {

      } else {
        // console.log("Empty field");
      }
   }

   return (
      <div className='signin w-100 h-100 pos-rel'>
         <div className="c-card rounded elevation-2 pos-abs to-center">
            {/* { Loading overlay */
               state.loading &&
               <div className="overlay rounded pos-abs wh-100">
                  <div className="pos-abs to-center"><CircularProgress /></div>
               </div>
            }
            <div className="card-header px-5 pt-5 mt-10 text-center">
               <h2 className='font-normal mb-5'>Welcome to</h2>
               <img className="d-block mx-auto" src={logo} />
            </div>
            <div className="form pa-10">
               <div className="input-group mb-4">
                  <label htmlFor="inp-userEmail">Username</label>
                  <input
                     onChange={handleInputChange}
                     value={state.userName}
                     type="text"
                     placeholder="Username or email address"
                     name="userName"
                     id="inp-userEmail"
                     className="w-100 px-3 mt-1"
                  />
               </div>
               <div className="input-group">
                  <label htmlFor="inp-userEmail">Password</label>
                  <input
                     onChange={handleInputChange}
                     value={state.password}
                     type="password"
                     placeholder="Password"
                     name="password"
                     id="inp-password"
                     className="w-100 px-3 mt-1"
                  />
               </div>
               <div className='d-flex pt-2'>
                  <div className="spacer"></div>
                  <a href="#" className="mw-max">Forgot password?</a>
               </div>
               <button onClick={loginUser} className="btn-signin w-100 mt-5">signin</button>
            </div>
            <div className="px-10 py-2">
               <div className='pos-rel'>
                  <hr className="divider light mx-auto" />
                  <p className='cont-with px-4 pos-abs to-center'>or continue with</p>
               </div>
            </div>
            <div className="px-10 py-2 mb-10">
               <a href="http://localhost:3875/auth/google">
                  <button className="btn-google w-100 mt-5">google</button>
               </a>
            </div>
         </div>
      </div>
   );
}

export default Login;
