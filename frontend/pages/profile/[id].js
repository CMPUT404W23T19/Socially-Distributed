import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import TopNavigation from '../TopNavigation'
import Link from 'next/link'
import Image from "next/image"
import { reqUserProfile, reqFollowOthers, reqGetFollowersList, reqPostToInbox, reqUnfollow, reqGetInbox } from '../../api/Api'
import { getCookieUserId } from '../../components/utils/cookieStorage'
import styles from './profile.module.css'
import { getUserIdFromUrl } from '../../components/common'

export default function UserProfile() {
  const router = useRouter()
  const [localId, setLocalId] = useState('')
  const { id } = router.query
  const [user, setUser] = useState(null)
  const [localUser, setLocalUser] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  // const host = 'http://127.0.0.1:8000'
  const host = 'https://floating-fjord-51978.herokuapp.com'
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
      reqUserProfile(localId)
        .then(
          res => {
            setLocalUser(res.data)
          },
          err => {
            console.log(err);
          }
        )
      reqGetFollowersList(id)
        .then(
          res => {
            const found = res.data.items.find(follower => getUserIdFromUrl(follower.id).toString() === localId);
            if (found) {
              setIsFollowing(true)
            } else {
              setIsFollowing(false)
            }
          },
          err => {
            console.log(err);
            setIsFollowing(false)
          }
        );
    }
  }, [id, localId, isFollowing])

  const goBack = () => {
    router.back();
  }

  const handleFollow = async (id) => {
    // handle follow here
    const data = {
      id: localId
    }
    reqFollowOthers(data, id, encodeURIComponent(localUser.id))
      .then(
        res => {
          setIsFollowing(true)
          // console.log(res);
          let summary = `${localId} want to follow ${id}`
          console.log(summary);
          const data = {
            "type": "follow",
            "summary": `${localId} want to follow ${id}`,
            "actor": {
              "id": `${host}/authors/${localId}`,
              "type": `${localUser.type}`,
              "display_name": `${localUser.display_name}`,
              "host": `${localUser.host}`,
              "github": `${localUser.github}`,
              "profile_image": `${localUser.profile_image}`,
              "url": `${localUser.url}`
            },
            "object": {
              "id": `${host}/authors/${id}`,
              "type": `${user.type}`,
              "display_name": `${user.display_name}`,
              "host": `${user.host}`,
              "github": `${user.github}`,
              "profile_image": `${user.profile_image}`,
              "url": `${user.url}`
            }
          }
          reqGetInbox(id)
            .then(
              res => {
                let a = res.data.items.findIndex(item => {
                  return item.actor.id === data.actor.id && item.object.id === data.object.id && item.type === data.type
                })
                if (a === -1) {
                  reqPostToInbox(data, id)
                    .then(
                      res => {
                        console.log('success');
                        // console.log(res);
                      },
                      err => {
                        console.log('fail');
                        console.log(err);
                      }
                    )
                }
              }
            )

        },
        err => {
          // console.log(err);
          setIsFollowing(false)
          alert(err)
        }
      )
  }

  const handleUnfollow = async (id) => {
    try {
      const res = await reqUnfollow(id, encodeURIComponent(localUser.id))
      if (res.status == 204) {
        setIsFollowing(false);
        console.log("success");
      }
    } catch (err) {
      setIsFollowing(false);
      console.log(err);
    }

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
      <button onClick={goBack} className="absolute top-0 left-0 mt-24 px-3 py-1 ml-10 rounded-md z-10 bg-gray-100 text-sm">← Back</button>
      <div className="pt-24 container max-w-2xl mx-auto flex-col items-center justify-center px-2">
        <div className="bg-lighter px-10 z-10 rounded-xl shadow-xl text-main w-full relative">
          {localId !== id && (
            isFollowing ? (
              <button className={styles.followButton} onClick={() => handleUnfollow(id)}>Following</button>
            ) : (
              <button onClick={() => handleFollow(id)} className={styles.followButton}>+ Follow</button>
            )
          )}
          <div>
            <div className='w-28 h-28 my-10 mx-auto'>
              <img className='w-28 h-28 rounded-full border-2 border-gray-100' src={user.profile_image ? user.profile_image : "../defaultUser.png"} alt="User" />
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-3xl font-semibold leading-none tracking-tighter mb-5">Username</h2>
              <p className="text-content ml-8 h-10 font-bold">{user.username ? 'not exist' : user.display_name}</p>
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-3xl font-semibold leading-none tracking-tighter mb-5">UserId</h2>
              <p className="text-content ml-8 h-10 font-bold">{user.id}</p>
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-3xl font-semibold leading-none tracking-tighter mb-5">Github</h2>
              <a><p className="text-content ml-8 h-10 font-bold">{user.github ? 'not exist' : user.github}</p></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default UserProfile;
