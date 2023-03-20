import React, { Component } from 'react';
import Link from 'next/link';

export default class CommonNav extends Component {
  render() {
    return (
      <div className='w-32 h-screen bg-gray-200 p-5' style={{ position: 'fixed', top: 0, left: 0, bottom: 0, right: 0 }}>
        <div className='flex flex-col justify-start'>
          <div className='h-10 pl-1 pt-1'>
          </div>
          <div className='my-4 border-b border-grey-100 pb-4'>
            <Link href='/post/'>
              <div className='flex mb-2 justify-start items-center pl-5 hover:bg-gray-400 p-2 rounded-md cursor-pointer '>
                <h3>Public</h3>
              </div>
            </Link>
            <Link href='/post/friends'>
              <div className='flex mb-2 justify-start items-center pl-5 hover:bg-gray-400 p-2 rounded-md cursor-pointer '>
                <h3>Friends</h3>
              </div>
            </Link>
            <Link href='/post/me'>
              <div className='flex mb-2 justify-start items-center pl-5 hover:bg-gray-400 p-2 rounded-md cursor-pointer'>
                <h3 className='text-white'>Me</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
