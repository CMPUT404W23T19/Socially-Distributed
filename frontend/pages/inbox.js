import React, { useEffect, useState } from 'react'
import TopNavigation from './TopNavigation'
import { reqGetFollowersList, reqGetInbox, reqPostToInbox, reqClearInbox, reqUserProfile } from '../api/Api'
import { getCookieUserId, getJWTToken } from '../components/utils/cookieStorage'
import FriendRequest from '../components/common/FriendRequest'
import { getUserIdFromUrl, getTime } from '../components/common'
import { reqFollowOthers } from '../api/Api'
import Styles from './styles.module.css'
import axios from 'axios'
import { Close } from '@material-ui/icons'
import Link from 'next/link'
import Markdown from 'markdown-to-jsx'

export default function inbox() {
  const [userId, setUserId] = useState('')
  const [user, setUser] = useState(null)
  const [friendRequestsList, setFriendRequestsList] = useState([])
  const [postList, setPostList] = useState([])
  const [commentList, setCommentList] = useState([])
  const [likeList, setLikeList] = useState([])
  const [isCleared, setIsCleared] = useState(false)
  const [isAccept, setIsAccept] = useState(false)
  useEffect(() => {
    setUserId(getCookieUserId)
    if (userId) {
      reqUserProfile(userId)
        .then(res => setUser(res.data), err => console.log(err))
      reqGetFollowersList(userId)
        .then(res => {
          const followers = res.data.items;
          const followerIds = followers.map(follower => follower.id)
          reqGetInbox(userId)
            .then(
              res => {
                const receivedList = res.data.items
                const requestsList = []
                const posts = []
                const comments = []
                const likes = []
                receivedList.forEach(element => {
                  if (element.type === 'follow') {
                    if (!followerIds.includes(element.actor.id)) {
                      requestsList.push(element)
                    }
                  }
                  else if (element.type === 'post') {
                    posts.push(element)
                  }
                  else if (element.type === 'comment') {
                    comments.push(element)
                  } else if (element.type === 'like') {
                    likes.push(element)
                  }
                });
                posts.sort((a, b) => {
                  return new Date(b.published) - new Date(a.published)
                })
                requestsList.sort((a, b) => {
                  return new Date(b.published) - new Date(a.published)
                })
                comments.sort((a, b) => {
                  return new Date(b.published) - new Date(a.published)
                })
                likes.sort((a, b) => {
                  return new Date(b.published) - new Date(a.published)
                })
                setPostList(posts)
                setFriendRequestsList(requestsList)
                setCommentList(comments)
                setLikeList(likes)
              },
              err => {
                console.log(err);
                alert(err)
              }
            )
        }, err => console.log('cannot get followers list'))

    }
  }, [userId, isCleared])


  const handleAcceptRequest = async (request) => {

    const res = await axios({
      url: `${request.object.host}/authors/${getUserIdFromUrl(request.object.id)}/followers/${request.actor.id}`,
      method: 'put',
      data: user,
      headers: {
        Authorization: `Bearer ${getJWTToken()}`,
      }
    })
    if (res.status >= 200 && res.status <= 300) {
      setIsAccept(true)
      setTimeout(() => {
        setFriendRequestsList(friendRequestsList.filter(frequest => frequest != request))
      }, 2000);
    }
  }

  const handleRefuseRequest = () => {

  }

  const handleClear = () => {
    reqClearInbox(userId)
      .then(
        res => {
          setIsCleared(true)
          return 'success'
        },
        err => {
          return 'fail'
        }
      )
  }
  if (friendRequestsList.length === 0 && postList.length === 0 && commentList.length === 0) {
    return (
      <div>
        <TopNavigation />
        <div className='mt-20 w-4/5 h-screen p-3 mx-auto border border-gray-100'>
          <h2 className='text-2xl font-semibold'>No new posts from your friends currently.</h2>
        </div>
      </div>
    );
  }
  else {
    return (
      <div>
        <TopNavigation />
        {isAccept && (
          <div>
            <div className="fixed w-screen h-screen opacity-80 bg-black z-30" onClick={() => setIsAccept(!isAccept)}></div>
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/4 z-40 rounded-md bg-gray-800 text-white">
              <div className='flex justify-between m-5'>
                <h2 className="text-base font-semibold mb-2">Accepted</h2>
                <span className='cursor-pointer' onClick={() => setIsAccept(!isAccept)}><Close /></span>
              </div>
            </div>
          </div>
        )}
        <div className='pt-16 w-4/5 h-screen py-3 mx-auto'>
          <div className='text-right pb-3 mb-3'>
            <button className={Styles.clearButton} onClick={handleClear}>Clear</button>
          </div>
          <div className='mb-8 px-5'>
            {friendRequestsList.map((request, index) => (
              <div key={index} className=' bg-gray-50 mb-2 rounded shadow'>
                <FriendRequest
                  id={request.actor.id}
                  displayName={request.actor.displayName}
                  profileImage={request.actor.profileImage}
                  acceptAction={() => handleAcceptRequest(request)}
                  refuseAction={() => handleRefuseRequest} />
              </div>
            ))}
          </div>
          <div className='mb-8 px-5'>
            {/* <h2 className='mb-3 text-lg ml-3 font-semibold'>Posts</h2> */}
            {postList.map((request, index) => {
              const nrequest = {
                "type": request.type,
                "title": request.title,
                "id": request.id,
                "source": request.source,
                "origin": request.origin,
                "description": request.description,
                "contentType": request.contentType,
                "content": request.content,
                "author": JSON.stringify(request.author),
                "comments": request.comments,
                "published": request.published,
                "visibility": request.published,
                "unlisted": request.unlisted
              }
              return (
                <Link href={{ pathname: "/postdetail", query: nrequest }} key={index} className='cursor-pointer'>
                  <div className='w-full px-8 py-2 my-3 bg-gray-50 rounded shadow'>
                    <div className='flex flex-row items-center justify-between'>
                      <div className='flex flex-row items-center'>
                        <img className='mr-4 w-8 h-8 rounded-full' src={request.author.profileImage ? request.author.profileImage : '../defaultUser.png'} />
                        <div className='flex flex-col'>
                          <p className='font-semibold mb-1'>{request.author.displayName}<span className='font-normal text-xs'> sends you a post</span></p>
                          {/* <span className='font-normal text-xs'>id: {request.author.id}</span> */}
                        </div>
                      </div>
                      <div><span>{getTime(request.published)}</span></div>
                    </div>
                    <p className="text-base mb-2 pb-1 font-semibold border-b border-gray-200">{request.title}</p>
                    {(request.contentType === "image/jpeg;base64" || request.contentType === "image/png:base64" || request.contentType === "application/base64") ? <img className='max-w-sm max-h-72' src={request.content}></img> :
                      <p className='text-xs font-normal text-gray-800'>{request.contentType === "text/plain" ? request.content : <Markdown className='text-xs font-normal text-gray-800'>{request.content}</Markdown>}</p>
                    }
                  </div>
                </Link>
              )
            })}
          </div>
          <div className='mb-8 px-5'>
            {/* <h2 className='mb-3 text-lg ml-3 font-semibold'>Comments</h2> */}
            {commentList.map((comment, index) => (
              <div key={index}>
                <div className='w-full px-8 py-2 mb-3 bg-gray-50 rounded shadow'>
                  <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row items-center'>
                      <img className='mr-4 w-8 h-8 rounded-full' src={comment.author.profileImage ? comment.author.profileImage : '../defaultUser.png'} />
                      <div className='flex flex-col'>
                        <p className='font-semibold mb-1'>{comment.author.displayName} <span className='font-normal text-xs'> comments on your post {postList.title}</span></p>
                        <span className='font-normal text-xs'>id: {comment.author.id}</span>
                      </div>
                    </div>
                    <div><span>{getTime(comment.published)}</span></div>
                  </div>
                  <p className='mt-2'>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className='mb-8 px-5'>
            {/* <h2 className='mb-3 text-lg ml-3 font-semibold'>Likes</h2> */}
            {likeList.map((like, index) => (
              <div key={index}>
                <div className='w-full px-8 py-2 mb-3 bg-gray-50 rounded shadow'>
                  <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row items-center'>
                      <img className='mr-4 w-8 h-8 rounded-full' src={like.author.profileImage ? like.author.profileImage : '../defaultUser.png'} />
                      <div className='flex flex-col'>
                        <p className='font-semibold mb-1'>{like.summary}</p>
                        {/* <span className='font-normal text-xs'>id: {like.author.id}</span> */}
                      </div>
                    </div>
                    <div><span>{getTime(like.published)}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
