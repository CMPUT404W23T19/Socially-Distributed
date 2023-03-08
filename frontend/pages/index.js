import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import ErrorMessage from '../components/common/ErrorMessage'
import FormField from '../components/common/FormField.js'
import Button from '../components/common/SubmitButton.js'
import RedirectLink from '../components/common/RedirectLink'
import { reqLogin, reqUserProfile } from '../api/Api'
import { setAccessToken } from '../components/utils/cookieStorage'


/**
 * Login form page
 * @returns jsx
 */
export default function LoginForm() {
  // const [emailId, setEmailId] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [emailError, setEmailError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter()
  let validCheck = false

  const handleUsernameChange = useCallback((event) => {
    // setEmailError('')
    // setEmailId(event.target.value)
    setUsernameError('')
    setUsername(event.target.value)
  }, [])

  const handlePasswordChange = useCallback((event) => {
    setPasswordError('')
    setPassword(event.target.value)
  }, [])

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault()
      // const isEmailEmpty = emailId.length === 0
      const isUsernameEmpty = username.length === 0
      const isPasswordEmpty = password.length === 0
      validCheck = true

      if (isUsernameEmpty) {
        setUsernameError('Username can not be empty.')
        validCheck = false
      }
      if (isPasswordEmpty) {
        setPasswordError('Password can not be empty.')
        validCheck = false
      }
      if (password.length < 8) {
        setPasswordError('Password length must be at least 8 characters.')
        validCheck = false
      }
      if (validCheck) {
        sendData(e)
      }
    },
    [username, password, usernameError, passwordError]
  )

  function sendData(e) {
    if (validCheck) {
      reqLogin({ username, password })
        .then(
          res => {
            console.log(res.data.access);
            setAccessToken(res.data.access)
            router.push('/home')
            
            // get user id
            // reqUserProfile()

          },
        ).catch(e => {
          const errorMessage = e.message
          setPasswordError('Username/Password is not valid.')
          console.error(errorMessage)
        })
      validCheck = true;
    }
  }

  return (
    <div className="bg-grey min-h-screen flex flex-col bg-no-repeat bg-cover">
      <div className="py-10 px-4 text-center text-black">
        <h1 className="text-4xl font-bold mb-2 text-blue-500">Welcome Back!</h1>
        <p className="text-lg">Login to continue to our site.</p>
      </div>
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-start px-2">
        <div className="bg-grey px-6 py-8 rounded-xl shadow-md text-black w-full ">
          <div>
            <h1 className="mb-8 text-3xl text-center">Login</h1>
            <form onSubmit={handleLogin}>
              <div>
                <h2 className="mb-4 text-lg font-medium text-gray-900">Enter your login details:</h2>
                <FormField
                  type="text"
                  name="username"
                  action={handleUsernameChange}
                  placeholder="Username"
                />
                <ErrorMessage error={usernameError} />

                <FormField
                  type="password"
                  name="password"
                  action={handlePasswordChange}
                  placeholder="Password"
                />
                <ErrorMessage error={passwordError} />

                <RedirectLink message={<a href="/forgotPassword" style={{ color: 'blue' }}>Forgot Password?</a>} />
                <Button name="Login" />

                <RedirectLink message={<a href="/signup" style={{ color: 'blue' }}>New User?</a>} />
                <RedirectLink message={<a href="/home" style={{ color: 'blue' }}>home test</a>} />

                {/* account created toast */}
                {router?.query?.isNew && (
                  <div
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
                    role="alert"
                  >
                    <p className="block sm:inline">Account created successfully.</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

