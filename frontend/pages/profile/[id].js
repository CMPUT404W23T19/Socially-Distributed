import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import TopNavigation from '../TopNavigation'
import { Close } from '@material-ui/icons'
import { getTime } from '../../components/common'
import { reqUserProfile, reqFollowOthers, reqGetFollowersList, reqPostToInbox, reqUnfollow, reqGetInbox, reqGetUserPosts } from '../../api/Api'
import { getCookieUserId } from '../../components/utils/cookieStorage'
import styles from './profile.module.css'
import { getUserIdFromUrl } from '../../components/common'
import Markdown from 'markdown-to-jsx'

export default function UserProfile() {
  const router = useRouter()
  const [localId, setLocalId] = useState('')
  const { id } = router.query
  const [user, setUser] = useState(null)
  const [localUser, setLocalUser] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowed, setIsFollowed] = useState(false)
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false)
  const [publicPosts, setPublicPosts] = useState([])

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
            const found = res.data.items.find(follower => getUserIdFromUrl(follower.id) == localId);
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
      reqGetFollowersList(localId)
        .then(
          res => {
            const found = res.data.items.find(follower => getUserIdFromUrl(follower.id) == id);
            if (found) {
              setIsFollowed(true)
            } else {
              setIsFollowed(false)
            }
          },
          err => {
            console.log(err);
            setIsFollowed(false)
          }
        )
      reqGetUserPosts(id)
        .then(
          res => {
            let posts = res.data.items;
            posts = posts.filter(post => post.visibility === "PUBLIC")
            setPublicPosts(posts)
          }
        )
    }
  }, [id, localId, isFollowing])

  const goBack = () => {
    router.back();
  }

  const handleFollow = async (id) => {
    // handle follow here
    const data = {
      "type": "follow",
      "summary": `${localUser.displayName} want to follow ${user.displayName}`,
      "actor": localUser,
      "object": user
    }
    // reqGetInbox(id)
    // .then(
    // res => {
    // let a = res.data.items.findIndex(item => {
    //   return item.actor.id === data.actor.id && item.object.id === data.object.id && item.type === data.type
    // })
    // if (a === -1) {
    reqPostToInbox(data, id)
      .then(
        res => {
          console.log('success');
          setIsSuccessPopupOpen(true)
          // console.log(res);
        },
        err => {
          console.log('fail');
          console.log(err);
        }
      )
    // } else {
    //   setIsSuccessPopupOpen(true)
    // }
    // }
    // )
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
      {isSuccessPopupOpen && (
        <div>
          <div className="fixed w-screen h-screen opacity-80 bg-black z-30" onClick={() => setIsSuccessPopupOpen(!isSuccessPopupOpen)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/4 z-40 rounded-md bg-gray-800 text-white">
            <div className='flex justify-between m-5'>
              <h2 className="text-base font-semibold mb-2">SUCCESS</h2>
              <span className='cursor-pointer' onClick={() => setIsSuccessPopupOpen(!isSuccessPopupOpen)}><Close /></span>
            </div>
            <div className='text-left m-5'>
              <p className='text-sm font-normal text-gray-100'>Your friend request is sent.</p>
            </div>
          </div>
        </div>
      )}
      <button onClick={goBack} className="absolute top-0 left-0 mt-24 px-3 py-1 ml-10 rounded-md z-10 bg-gray-100 text-sm">← Back</button>
      <div className="pt-24 container h-screen max-w-2xl mx-auto flex-col items-center justify-center px-2">
        <div className="bg-lighter px-10 z-10 rounded-xl shadow-xl text-main w-full relative">
          {localId !== id && (
            isFollowing && isFollowed ? (
              <button className={styles.followButton} onClick={() => handleUnfollow(id)}>Friend</button>
            ) : (isFollowing ?
              (<button onClick={() => handleUnfollow(id)} className={styles.followButton}>Following</button>) :
              (<button onClick={() => handleFollow(id)} className={styles.followButton}>+ Follow</button>)

            )
          )}
          <div>
            <div className='w-28 h-28 my-10 mx-auto'>
              <img className='w-28 h-28 rounded-full border-2 border-gray-100' src={user.profileImage ? user.profileImage : "../defaultUser.png"} alt="User" />
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-xl font-semibold leading-none text-gray-500 tracking-tighter mb-5">Display Name</h2>
              <p className="text-content ml-8 h-10 font-bold">{user.displayName}</p>
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-xl font-semibold leading-none text-gray-500 tracking-tighter mb-5">User Id</h2>
              <p className="text-content ml-8 h-10 font-bold">{user.id}</p>
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-xl font-semibold leading-none text-gray-500 tracking-tighter mb-5">Github Url</h2>
              <a><p className="text-content ml-8 h-10 font-bold">{user.github ? user.github : 'Not Exist'}</p></a>
            </div>
            <div className='mb-8'>
              <h1 className='font-bold text-xl border-t-4 border-gray-200 pt-3'>Posts</h1>
              {publicPosts.map(post => (
                post.visibility === 'PUBLIC' &&
                <div key={post.id} className="bg-gray-50 p-5 rounded shadow-md my-2">
                  <div>
                    <div className='flex justify-between'>
                      <div className="flex items-center mb-3">
                        <img src={post.author.profileImage ? post.author.profileImage : "../defaultUser.png"} alt="" className="w-8 h-8 rounded-full mr-2" />
                        <h2 className="text-lg font-semibold">{post.author.displayName}</h2>
                      </div>
                      <div className='text-right'>
                        <p className='text-gray-600 text-sm'>{getTime(post.published)}</p>
                        <p className='text-gray-600 text-xs'>{post.visibility}</p>

                      </div>
                    </div>
                    <p className="text-base mb-3 font-semibold pb-1 border-b border-gray-200 text-gray-600">{post.title}</p>
                  </div>
                  <p className="text-xs mb-3">{post.contentType === "text/plain" ? post.content : <Markdown>{post.content}</Markdown>}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default UserProfile;
