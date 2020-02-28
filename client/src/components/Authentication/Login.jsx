import React from 'react';

// Components
import TextField from "../custom/TextField/TextFiled"
import Button from "../custom/Button/Button"

const Login = ({ onActiveChange,onForgotPass }) => {
   return (
      <div className="login">
         <div className='text-center py-5'>
            <h2 className='mb-3 font-normal'>Signin</h2>
            <p className='txt-sec'>Signin with your email and password</p>
         </div>
         <div className='form mt-10 mb-5'>
            <div className='mb-2'>
               <TextField pill white
                  label="Email address"
                  hint="Email address"
               />
            </div>
            <div className='mb-2'>
               <TextField pill white
                  type="password"
                  label="Password"
                  hint="Enter password"
               />
            </div>
            <p onClick={onForgotPass} className='forgot-pass ta-r pointer'>Forgot password?</p>
         </div>
         <div className='py-5 pb-10'>
            <div className='mb-4'>
               <Button pill w100 color='teal'>login</Button>
            </div>
            <Button onClick={() => onActiveChange("REGISTER")} pill w100 outlined color='teal'>Create account</Button>
         </div>
      </div>
   );
}

export default Login;
