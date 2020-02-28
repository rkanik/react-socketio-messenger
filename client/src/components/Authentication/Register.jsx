import React from 'react';

// Components
import TextField from "../custom/TextField/TextFiled"
import Button from "../custom/Button/Button"

const Register = ({ onActiveChange }) => {

   return (
      <div className="register">
         <div className='text-center py-5'>
            <h2 className='mb-3 font-normal'>Register</h2>
            <p className='txt-sec'>Create your messenger account</p>
         </div>
         <div className='form my-10'>
            <div className='mb-2'>
               <TextField pill white
                  label="Full Name"
                  hint="Enter your Name"
               />
            </div>
            <div className='mb-2'>
               <TextField pill white
                  label="Email address"
                  hint="Enter your email address"
               />
            </div>
            <div className='mb-2'>
               <TextField pill white
                  type="password"
                  label="Password"
                  hint="Enter your password"
               />
            </div>
            <div className='mb-2'>
               <TextField pill white
                  type="password"
                  label="Confirm password"
                  hint="Enter password again"
               />
            </div>
         </div>
         <div className='py-5 pb-10'>
            <div className='mb-4'>
               <Button pill w100 color='teal'>Register</Button>
            </div>
            <Button
               onClick={() => onActiveChange("LOGIN")}
               pill w100 outlined color='teal'
            >
               login here
            </Button>
         </div>
      </div>
   )
}

export default Register;
