import React, { Component } from 'react'
import FormField from '../components/common/FormField.js'
export default class signup extends Component {
  render() {
    return (
      <div className="bg-grey min-h-screen flex flex-col bg-no-repeat bg-cover">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-grey px-6 py-8 rounded-xl shadow-md text-black w-full ">
            <form>
              <h1 className="mb-8 text-3xl text-center">Sign up</h1>

              <FormField
                type="username"
                name="username"
                placeholder="Username"
              />
              <FormField
                type="email"
                name="email"
                placeholder="Email"
              />

              <FormField
                type="password"
                name="password"
                placeholder="Password"
              />

              <FormField
                type="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
              />

              <p className='w-full text-center pt-5'>
              <a className="inline-block align-baseline font-bold text-sm text-secondary bg-gray-400 text-white px-8 py-1 hover:bg-gray-300" href='/login'>
                Sign Up
              </a>
              </p>

            </form>
          </div>
        </div>
      </div>
    )
  }
}
