import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NavHeader from './TopNavigation'
import Link from 'next/link'
import Image from "next/image"
import { reqUserProfile, reqUserId } from '../api/Api'
import { getCookieUserId } from '../components/utils/cookieStorage'
function ProfilePage() {
  const [userId, setUserId] = useState(0)
  const [username, setUsername] = useState('')
  const [github, setGithub] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  // router
  const router = useRouter()

  useEffect(() => {
    setUserId(getCookieUserId())
    if (userId !== 0) {
      reqUserProfile(userId)
        .then(
          res => {
            setUsername(res.data.display_name)
            setGithub(res.data.github)
            setImageUrl(res.data.profile_image)
            console.log(res.data.profile_image);
          }
        ).catch(
          e => {
            console.log(e);
          }
        )
    }
  })


  return (
    <div className="bg-primary min-h-screen flex flex-col">
      <div>
        <NavHeader />
      </div>
      <Link href='/editprofile'>
        <div className="mt-20 text-center">
          <button
            className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white shadow-xl font-bold mt-8w-full py-2 px-6 rounded focus:outline-none focus:shadow-outline transition"
          >
            Edit profile
          </button>
        </div>
      </Link>
      <div className="container max-w-2xl mx-auto flex-col items-center justify-center px-2">
        <div className="bg-lighter px-10 h-4/5 rounded-xl shadow-xl text-main w-full">
          <div>
            <div className='w-28 h-28 my-10 mx-auto'>
              <img className='w-28 h-28 rounded-full border-2 border-gray-100' src={imageUrl ? imageUrl : "defaultUser.png"} alt="my img" />
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-3xl font-bold leading-none tracking-tighter mb-5">Username</h2>
              <p className="text-content ml-8 h-10 font-bold">{username == '' ? 'test username' : username}</p>
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-3xl font-bold leading-none tracking-tighter mb-5">Github</h2>
              <a><p className="text-content ml-8 h-10 font-bold">{github == '' ? 'test github' : github}</p></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
