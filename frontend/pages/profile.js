import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NavHeader from './TopNavigation'
import Link from 'next/link'
import Image from "next/image"
import { reqUserProfile, reqUserId, reqGetUserPosts, reqGetAuthorsList, reqGetFollowersList } from '../api/Api'
import { getCookieUserId } from '../components/utils/cookieStorage'
import { Close } from '@material-ui/icons'
import { getUserIdFromUrl } from '../components/common'
import followerStyle from './styles.module.css'

function ProfilePage() {
  const [userId, setUserId] = useState(0)
  const [username, setUsername] = useState('')
  const [github, setGithub] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [postsList, setPostsList] = useState([])
  const [followersList, setFollowersList] = useState([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isDarkBackground, setIsDarkBackground] = useState(false)
  const [userUrl, setUserUrl] = useState('')
  // router
  const router = useRouter()

  useEffect(() => {
    setUserId(getCookieUserId())
    if (userId !== 0) {
      reqUserProfile(userId)
        .then(
          res => {
            setUsername(res.data.displayName)
            setGithub(res.data.github)
            setImageUrl(res.data.profileImage)
            setUserUrl(res.data.id)
            console.log(res.data.profileImage);
          }
        ).catch(
          e => {
            console.log(e);
          }
        )
      reqGetUserPosts(userId)
        .then(
          res => {
            setPostsList(res.data.items)
          }
        )
      reqGetFollowersList(userId)
        .then(
          res => {
            setFollowersList(res.data.items)
          }
        )
    }
  }, [userId])

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setIsDarkBackground(!isDarkBackground);
  }

  return (
    <div className="bg-primary min-h-screen flex flex-col">
      {isDarkBackground && (
        <div className="fixed w-screen h-screen opacity-40 bg-black" />
      )}
      <div>
        <NavHeader />
      </div>

      <div className="container max-w-2xl mx-auto flex-col items-center justify-center px-2 mt-24">
        <div className="bg-lighter px-10 h-4/5 rounded-xl shadow-xl text-main w-full">
          <div>
            {isPopupOpen && (
              <div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/2 z-50 rounded-md bg-white"
              >
                <div className='flex justify-between border-b border-gray-200 m-5'>
                  <h2 className="text-base font-semibold mb-2">Followers</h2>
                  <span className='cursor-pointer' onClick={togglePopup}><Close /></span>
                </div>
                <ul className='ml-5 w-11/12 h-3/4 overflow-y-scroll'>
                  {followersList.map((follower) => (
                    <Link key={follower.id} href="/profile/[id]" as={`/profile/${getUserIdFromUrl(follower.id)}`}>
                      <li className={followerStyle.follower}>
                        <img className='mr-4 w-12 h-12 rounded-full' src={follower.profileImage ? follower.profileImage : 'defaultUser.png'} />
                        <span>{follower.displayName}</span>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            )}
            <div className='flex flex-row pt-4'>
              <div className='w-28 h-28 mb-10 '>
                <img className='w-28 h-28 rounded-full border-2 border-gray-100' src={imageUrl ? imageUrl : "defaultUser.png"} alt="my img" />
              </div>
              <div className='mt-3 ml-14 flex flex-col text-left'>
                <div>
                  <Link href='/editprofile'>
                    <div className="text-left">
                      <button
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 font-semibold mt-8w-full py-1 px-4 rounded-md focus:outline-none focus:shadow-outline transition"
                      >
                        Edit profile
                      </button>
                    </div>
                  </Link>
                </div>
                <ul className='py-3 list-none'>
                  <li className='inline mr-5'><Link href='/post/me'><p className='font-semibold inline cursor-pointer'>{postsList.length}&nbsp;posts</p></Link></li>
                  <li className='inline mr-5'><button onClick={togglePopup}><span className='font-semibold'>{followersList.length}&nbsp;</span>followers</button></li>
                </ul>
              </div>
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold leading-none text-gray-500 tracking-tighter mb-5">Display Name</h2>
              <p className="text-content ml-8 h-10 font-bold">{username == '' ? 'Not exist' : username}</p>
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold leading-none text-gray-500 tracking-tighter mb-5">User Id</h2>
              <p className="text-content ml-8 h-10 font-bold">{userUrl == '' ? 'Not exist' : userUrl}</p>
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold leading-none text-gray-500 tracking-tighter mb-5">Github Url</h2>
              <a><p className="text-content ml-8 h-10 font-bold">{github == '' ? 'Not exist' : github}</p></a>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default ProfilePage
