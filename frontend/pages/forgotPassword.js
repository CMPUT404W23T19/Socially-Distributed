import React, { Component } from 'react';
import FormField from '../components/common/FormField';

export default class ForgotPassword extends Component {
  render() {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col bg-no-repeat bg-cover">
        <div className="container max-w-lg mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded-lg shadow-md w-full">
            <h1 className="mb-8 text-3xl text-center font-bold">Forgot Password</h1>

            <p className="text-gray-700 text-lg mb-5">
              Enter your email address below and we'll send you a link to reset your password.
            </p>

            <form className="mb-4">
              <FormField
                type="email"
                name="email"
                placeholder="Email Address"
              />
            </form>

            <button className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 focus:outline-none focus:shadow-outline">
              Send Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }
}
