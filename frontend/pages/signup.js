import React, { Component } from 'react'
import RedirectLink from '../components/common/RedirectLink'
import signupForm from './signup.module.css'
// import {Link} from 'next/link'
// import Button from '../components/common/SubmitButton'
export default class signup extends Component {
  render() {
    const {container, title, input_style} = signupForm;
    return (
      <div className={container}>
        <h1 className={title}>Sign up</h1>
        <input className={input_style} placeholder='Username'/><br/>
        <input className={input_style} placeholder='Email'/><br/>
        <input className={input_style} placeholder='Password'/><br/>
        <input className={input_style} placeholder='Confirm Password'/><br/>
        {/* <button><Link to="/index">Sign up</Link></button> */}
        <button><RedirectLink href="/"></RedirectLink></button>
        {/* <Button name="Sign up"></Button> */}
        {/* <Link to='/index'>sign up</Link> */}
      </div>
    )
  }
}
