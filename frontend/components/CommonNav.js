import React, { Component } from 'react'

export default class CommonNav extends Component {
  render() {
    return (
      <div className='w-52 h-screen bg-gray-200 p-5 '>
        <div className='flex flex-col justify-start'>
          <div className='h-10 pl-1 pt-1'>
            <img className='rounded-full h-8 w-8' src='../public/testUserImage.jpeg'/></div>
          <div className='my-4 border-b border-grey-100 pb-4'>
            <div className='flex mb-2 justify-start items-center pl-5 hover:bg-gray-400 p-2 rounded-md cursor-pointer '>
              <h3>Profile</h3>
            </div>
            <div className='flex mb-2 justify-start items-center pl-5 hover:bg-gray-400 p-2 rounded-md cursor-pointer '>
              <h3>Public</h3>
            </div>
            <div className='flex mb-2 justify-start items-center pl-5 hover:bg-gray-400 p-2 rounded-md cursor-pointer '>
              <h3>Comments</h3>
            </div>

          </div>
          <div className='flex mb-2 justify-start items-center pl-5 hover:bg-gray-400 p-2 rounded-md cursor-pointer '>
            <h3>Logout</h3>
          </div>
        </div>
      </div>
    )
  }
}
