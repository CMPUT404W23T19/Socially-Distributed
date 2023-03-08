import React, { useState } from 'react'
import FormField from '../components/common/FormField.js'
import { useRouter } from 'next/router';
import { reqSignUp } from '../api/Api.js';

export default function Signup() {
  const router = useRouter();
  const [username, setRegisterUserName] = useState('')
  const [password, setRegisterPassword] = useState('')
  const [confirmPassword, setRegisterConfirmPassword] = useState('')
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = (event) => {
    event.preventDefault();

    if (!username) {
      setError('Please enter a username');
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

    const userInfo = { username, password }
    storeUser(userInfo);
    // if (success) {
    //   router.push('/')
    // }
  }

  async function storeUser(userInfo) {
    try {
      let result = await reqSignUp(userInfo);
      if (result.status >= 200 && result.status <= 300) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/')
        }, 2000);
      }
    } catch (error) {
      let usernameError = error.response.data.username
      let passwordError = error.response.data.password
      if (usernameError) {
        usernameError.forEach(error => alert(error))
      } else if (passwordError) {
        passwordError.forEach(error => {
          alert(error)
        });
      }
      console.log(error);
    }
  }
  // todo: change alerting error to displaying error on the form
  /* use [usernameError, setUsernameError] = setState([]) */

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
            <a href="/" className='text-right text-blue-500 text-sm hover:text-blue-700'>Already have an account?</a>

          </form>
          {success && <p className='mt-3 text-center text-red-600 text-base'>Success! Redirecting to login...</p>}
        </div>
      </div>
    </div>
  )
}
