import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import TopNavigation from '../TopNavigation'
import Link from 'next/link'
import Image from "next/image"
import { reqUserProfile, reqFollowOthers, reqGetFollowersList } from '../../api/Api'
import { getCookieUserId } from '../../components/utils/cookieStorage'
import styles from './profile.module.css'
import { getUserIdFromUrl } from '../../components/common'

export default function UserProfile() {
  const router = useRouter()
  const [localId, setLocalId] = useState('')
  const { id } = router.query
  const [user, setUser] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  useEffect(() => {
    setLocalId(getCookieUserId())
    if (localId && id) {
      reqUserProfile(id)
        .then(
          res => {
            setUser(res.data);
          },
          err => {
            console.log(err);
          }
        );
      reqGetFollowersList(id)
        .then(
          res => {
            const found = res.data.items.find(follower => getUserIdFromUrl(follower.id).toString() === localId);
            if (found) {
              setIsFollowing(true)
            }
          },
          err => {
            console.log(err);
          }
        );
    }
  }, [localId, isFollowing])

  const goBack = () => {
    router.back();
  }

  const handleFollow = (id) => {
    // handle follow here
    const current_author = getCookieUserId();
    const data = {
      id: current_author
    }
    reqFollowOthers(data, id, current_author)
      .then(
        res => {
          setIsFollowing(true)
          console.log(res);
        },
        err => {
          // console.log(err);
          alert(err)
        }
      )
  }

  if (!user) {
    return (
      <div>
        <TopNavigation />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* {console.log(user)} */}
      <TopNavigation />
      <button onClick={goBack} className="absolute top-0 left-0 mt-24 px-3 py-1 ml-10 rounded-md bg-gray-100 text-sm">← Back</button>
      <div className="mt-24 container max-w-2xl mx-auto flex-col items-center justify-center px-2">
        <div className="bg-lighter px-10 h-4/5 rounded-xl shadow-xl text-main w-full relative">
          {localId !== id && (
            isFollowing ? (
              <button className={styles.followButton}>Following</button>
            ) : (
              <button onClick={() => handleFollow(id)} className={styles.followButton}>+ Follow</button>
            )
          )}
          <div>
            <div className='w-28 h-28 my-10 mx-auto'>
              <img className='w-28 h-28 rounded-full border-2 border-gray-100' src={user.profile_image ? user.profile_image : "../defaultUser.png"} alt="User" />
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-3xl font-bold leading-none tracking-tighter mb-5">Username</h2>
              <p className="text-content ml-8 h-10 font-bold">{user.username == '' ? 'test username' : user.display_name}</p>
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-3xl font-bold leading-none tracking-tighter mb-5">Github</h2>
              <a><p className="text-content ml-8 h-10 font-bold">{user.github == '' ? 'test github' : user.github}</p></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default UserProfile;
