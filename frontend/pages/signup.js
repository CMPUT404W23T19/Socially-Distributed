import React, { useState } from 'react'
import FormField from '../components/common/FormField.js'
import { useRouter } from 'next/router';
import axios from "axios";

export default function Signup() {
  const router = useRouter();
  const [username, setRegisterUserName] = useState('')
  const [email, setRegisterEmail] = useState('')
  const [password, setRegisterPassword] = useState('')
  const [confirmPassword, setRegisterConfirmPassword] = useState('')
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const userInfo = {username, email, password} // id?
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const register = (event) => {

    event.preventDefault();

    if (!username) {
      setError('Please enter a username');
      return;
    }

    if (!email) {
      setError('Please enter an email');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your password');
      return;
    }

    
    if (password.length < 8) {
      setError('Password length must be at least 8 characters.')
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email');
      return
    }

    setSuccess(true);

    storeUser(userInfo);

    try {
      setTimeout(() => {
        router.push('/')
      }, 3000);   
    } catch (error) {
      console.log(error);
    } 
  }
  
  // todo: store new user info
  function storeUser(userInfo) {

  }

  return (
    <div className="bg-grey min-h-screen flex flex-col bg-no-repeat bg-cover">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-grey px-6 py-8 rounded-xl shadow-md text-black w-full ">
          <form>
            <h1 className="mb-8 text-3xl text-center">Sign up</h1>
            {error && <div className='text-red-600 text-xs'>{error}</div>}
            <FormField
              type="username"
              name="username"
              action={e => setRegisterUserName(e.target.value)}
              placeholder="Username"
            />
            <FormField
              type="email"
              name="email"
              action={e => setRegisterEmail(e.target.value)}
              placeholder="Email"
            />

            <FormField
              type="password"
              name="password"
              action={e => setRegisterPassword(e.target.value)}
              placeholder="Password"
            />

            <FormField
              type="password"
              name="confirmPassword"
              action={e => setRegisterConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />

            <button onClick={register} className="w-full text-center mt-5 bg-gray-400 text-white px-8 py-2 hover:bg-gray-300">
              Sign Up
            </button>

          </form>
          {/* <h3>{success? 'Success!'}</h3> */}
          {success && <p className='mt-3 text-center text-red-600 text-base'>Success! Redirecting to login...</p>}
        </div>
      </div>
    </div>
  )
}
