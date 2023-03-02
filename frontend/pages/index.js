import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import ErrorMessage from '../components/common/ErrorMessage'
import FormField from '../components/common/FormField.js'
import Button from '../components/common/SubmitButton.js'
import RedirectLink from '../components/common/RedirectLink'
// import Home from './home'
// import { post } from '../components/utils/Api'
// import { setAccessToken, setRefreshToken } from '../components/utils/CookieStorage'

/**
 * Login form page
 * @returns jsx
 */
export default function LoginForm() {
  const [emailId, setEmailId] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter()
  let validCheck = false

  const handleEmailChange = useCallback((event) => {
    setEmailError('')
    setEmailId(event.target.value)
  }, [])

  const handlePasswordChange = useCallback((event) => {
    setPasswordError('')
    setPassword(event.target.value)
  }, [])

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault()
      const isEmailEmpty = emailId.length === 0
      const isPasswordEmpty = password.length === 0
      validCheck = true

      if (isEmailEmpty) {
        setEmailError('Email can not be empty.')
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
    [emailId, password, emailError, passwordError]
  )

  function sendData(e) {
    if (validCheck) {
      post('auth/jwt/create/', e.target)
        .then((res) => {
          setAccessToken(res.access)
          setRefreshToken(res.refresh)
          if (router.query.isNew) {
            //if new to skillcity, redirect to profile to edit a new profile.
            router.push('/profile')
          } else {
            //if not new to skillcity, redirect to dashboard.
            router.push('/dashboard')
          }
        })
        .catch((e) => {
          const errorMessage = e.message
          setPasswordError('Username/Password is not valid.')
          console.error(errorMessage)
        })
      validCheck = true
    }
  }

  return (
    <div className="bg-grey min-h-screen flex flex-col bg-no-repeat bg-cover">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-grey px-6 py-8 rounded-xl shadow-md text-black w-full ">
          <form onSubmit={handleLogin}>
            <h1 className="mb-8 text-3xl text-center">Login</h1>

            <FormField
              type="email"
              name="username"
              action={handleEmailChange}
              placeholder="Email"
            />
            <ErrorMessage error={emailError} />

            <FormField
              type="password"
              name="password"
              action={handlePasswordChange}
              placeholder="Password"
            />
            <ErrorMessage error={passwordError} />

            <RedirectLink message="Forgot Password?" href="/request-reset" />
            <Button name="Login" />

            <RedirectLink message="New?" href="/signup" />
            <RedirectLink message="home test" href="/home" />

            {/* account created toast */}
            {router?.query?.isNew && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4"
                role="alert"
              >
                <p className="block sm:inline">Account created successfully.</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

