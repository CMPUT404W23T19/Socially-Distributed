import React, { useEffect, useState } from 'react'
import TopNavigation from './TopNavigation'
import { reqGetFollowersList, reqGetInbox, reqPostToInbox, reqClearInbox, reqUserProfile } from '../api/Api'
import { getCookieUserId } from '../components/utils/cookieStorage'
import FriendRequest from '../components/common/FriendRequest'
import { getUserIdFromUrl, getTime } from '../components/common'
import { reqFollowOthers } from '../api/Api'
import Styles from './styles.module.css'
import axios from 'axios'
import { Close, Policy } from '@material-ui/icons'

export default function inbox() {
  const [userId, setUserId] = useState('')
  const [user, setUser] = useState(null)
  const [friendRequestsList, setFriendRequestsList] = useState([])
  const [postList, setPostList] = useState([])
  const [isCleared, setIsCleared] = useState(false)
  const [isAccept, setIsAccept] = useState(false)
  const [post1, setPost] = useState(null)
  useEffect(() => {
    setUserId(getCookieUserId)
    if (userId) {
      reqUserProfile(userId)
        .then(res => setUser(res.data), err => console.log(err))
      reqGetInbox(userId)
        .then(
          res => {
            const receivedList = res.data.items
            const requestsList = []
            const posts = []
            receivedList.forEach(element => {
              if (element.type === 'follow') {
                requestsList.push(element)
              }
              if (element.type === 'post') {
                posts.push(element)
              }
            });
            setPostList(posts)
            setFriendRequestsList(requestsList)
          },
          err => {
            console.log(err);
            alert(err)
          }
        )
// ########## code to be deleted
      axios({
        url: "https://distributed-social-net.herokuapp.com/service/authors/6952efd6743149eb86c472b96d84109a/posts/f086554a96124638ad6bff2777defca5",
        method: "get"
      }).then(
        res => {
          setPost(res.data)
        }
      )
// ##########
    }
  }, [userId, isCleared])


  const handleAcceptRequest = async (request) => {

    const res = await axios({
      url: `${request.object.host}/authors/${getUserIdFromUrl(request.object.id)}/followers/${request.actor.id}`,
      method: 'put',
      data: user
    })
    if (res.status >= 200 && res.status <= 300) {
      setIsAccept(true)
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
  if (friendRequestsList.length === 0 && postList.length === 0) {
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
        <div className='pt-16 w-4/5 h-screen py-3 mx-auto border border-gray-100'>
          <div className='text-right border-b border-gray-200 pb-3 mb-3'>
            <button className={Styles.clearButton} onClick={handleClear}>Clear</button>
          </div>
          {friendRequestsList.map(request => (
            <div key={request.id}>
              <FriendRequest
                id={request.actor.id}
                displayName={request.actor.displayName}
                profileImage={request.actor.profile_image}
                acceptAction={() => handleAcceptRequest(request)}
                refuseAction={() => handleRefuseRequest} />
            </div>
          ))}
          {postList.map(request => {
            return (<div key={request.id}>
              <div className='w-full border-b border-gray-200 pl-3 py-2'>
                <div className='flex flex-row items-center justify-between'>
                  <div className='flex flex-row items-center'>
                    <img className='mr-4 w-12 h-12 rounded-full' src={request.author.profile_image ? request.author.profile_image : '../defaultUser.png'} />
                    <div className='flex flex-col'>
                      <span className='font-semibold mb-1'>{request.author.displayName}</span>
                      <span className='font-normal text-xs'>id: {request.author.id}</span>
                    </div>
                  </div>
                  <div><span>{getTime(request.published)}</span></div>
                </div>
                <p className="text-base mb-3 font-semibold">{request.title}</p>
                <p>{request.content}</p>
              </div>
            </div>)
          })}
          {/* code below: to be deleted */}
          {post1 && (<div className='w-full border-b border-gray-200 pl-3 py-2'>
            <div className='flex flex-row items-center justify-between'>
              <div className='flex flex-row items-center'>
                <img className='mr-4 w-12 h-12 rounded-full' src={post1.profile_image ? post1.profile_image : '../defaultUser.png'} />
                <div className='flex flex-col'>
                  <span className='font-semibold mb-1'>{post1.author.displayName}</span>
                  <span className='font-normal text-xs'>id: {post1.author.id}</span>
                </div>
              </div>
              <div><span>{getTime(post1.published)}</span></div>
            </div>
            <p className="text-base mb-3 font-semibold">{post1.title}</p>
            <p>{post1.content}</p>
          </div>)
          }
        </div>
      </div>
    )
  }
}
