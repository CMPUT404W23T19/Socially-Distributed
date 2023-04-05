import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import TopNavigation from './TopNavigation'
import { reqUserProfile, reqEditUserProfile } from '../api/Api'
import { getCookieUserId } from '../components/utils/cookieStorage'

export default function EditProfileForm() {
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [github, setGithub] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [userProfile, setUserProfile] = useState(null)
  const router = useRouter()

  useEffect(() => {
    setUserId(getCookieUserId)
    if (userId) {
      reqUserProfile(userId)
        .then(
          res => {
            setUserProfile(res.data)
            setUsername(res.data.displayName)
            if (res.data.github) {
              setGithub(res.data.github)
            }
            setImageUrl(res.data.profileImage)
            // cannot set image
          }
        ).catch(
          e => {
            console.log(e);
            alert(e)
          }
        )
    }
  }, [userId])

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value)
  }, [])
  const handleGithubChange = useCallback((event) => {
    setGithub(event.target.value)
  }, [])
  const handleImageChange = useCallback((event) => {
    setImageUrl(event.target.value)
  }, [])

  /**
   * handles submit edit profile
  */
  const handleEditProfile = async (e) => {
    e.preventDefault();
    let updatedProfile = userProfile;
    updatedProfile.profileImage = imageUrl
    updatedProfile.github = github
    updatedProfile.displayName = username
    console.log(updatedProfile);
    const res = await reqEditUserProfile(userId, updatedProfile);
    if (res.status === 200) {
      setTimeout(() => {
        router.push('/profile')
      }, 1000);
    }
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
            {/* <div className='h-24 w-full text-center'> */}
            <img className='userPhoto w-24 h-24 mx-auto rounded-full' src={imageUrl ? imageUrl : 'defaultUser.png'} />
            {/* </div> */}
            <p>Image</p>
            <input
              type='text'
              className='border w-full border-grey-light p-2 rounded-xl my-5 block'
              placeholder='Image Url'
              value={imageUrl}
              onChange={handleImageChange}
            />
            <p>Display Name</p>
            <input
              type='text'
              className='border w-full border-grey-light p-2 rounded-xl my-5 block'
              placeholder='Display Name'
              value={username}
              onChange={handleUsernameChange}
            />
            <p>Github</p>
            <input
              type='text'
              className='border w-full border-grey-light p-2 rounded-xl mb-5 block'
              placeholder='https://github/username'
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
