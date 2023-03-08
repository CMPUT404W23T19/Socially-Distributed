import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import TopNavigation from './TopNavigation'

export default function EditProfileForm() {
  const [id, setId] = useState('')
  const [username, setUsername] = useState('')
  const [github, setGithub] = useState('')
  const [followerData, setfollowerData] = useState([])

  const router = useRouter()

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value)
  }, [])
  const handleGithubChange = useCallback((event) => {
    setGithub(event.target.value)
  }, [])

  /**
   * handles submit edit profile
   */
  // const handleEditProfile = useCallback()
  const handleEditProfile = (e) => {
    e.preventDefault();
    router.push('/profile')
  }

  return (
    <div className="bg-primary min-h-screen flex flex-col">
      <div>
        <TopNavigation />
      </div>
      <button className='mt-20 bg-blue-600 font-bold px-3 py-1 w-20 text-white rounded-md ml-6' onClick={() => router.back()}>{'<'} back</button>
      <div className="container mx-auto mt-2 max-w-2xl flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-lighter px-5 rounded-xl shadow-md w-full">
          <form onSubmit={handleEditProfile}>
            <h1 className="mb-8 text-3xl text-center">Edit Your Profile</h1>
            <input
              type='text'
              className='border w-full border-grey-light p-2 rounded-xl my-5 block'
              placeholder='Username'
              value={username}
              onChange={handleUsernameChange}
            />
            <input
              type='text'
              className='border w-full border-grey-light p-2 rounded-xl mb-5 block'
              placeholder='Github account'
              value={github}
              onChange={handleGithubChange}
            />
            <button className="w-full py-2 my-5 bg-gray-300 text-white hover:bg-gray-400 rounded">Confirm</button>
          </form>
        </div>
      </div>
    </div>
  )
}
