import React, { useState } from 'react';
import "./TextField.scss"

const TextFiled = ({ type, hint, label, rounded, pill, value, onChange, dark, ...rest }) => {

   const [text, setText] = useState(value || '')
   const handleChange = ({ target: { value } }) => {
      setText(value)
      onChange && onChange(value)
   }

   const classes = [
      rounded && 'rounded',
      pill && 'pill',
      dark
         ? 'dark' : rest['light-teal']
         ? 'light-teal' : rest['white']
         ? 'white' : 'light',
   ]

   return (
      <div className="custom-text-field">
         {label && <><label>{label}</label><br /></>}
         <input
            type={type || 'text'}
            placeholder={hint || 'Enter your text here'}
            className={classes.filter(c => c).join(" ")}
            value={text}
            onChange={handleChange}
         />
      </div>
   )
}

export default TextFiled;