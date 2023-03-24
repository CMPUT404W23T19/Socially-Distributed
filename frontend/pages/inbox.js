import React, { useEffect, useState } from 'react'
import TopNavigation from './TopNavigation'
import { reqGetFollowersList, reqGetInbox, reqPostToInbox, reqClearInbox, reqUserProfile } from '../api/Api'
import { getCookieUserId } from '../components/utils/cookieStorage'
import FriendRequest from '../components/common/FriendRequest'
import { getUserIdFromUrl } from '../components/common'
import { reqFollowOthers } from '../api/Api'
import Styles from './styles.module.css'
import axios from 'axios'
import { Close } from '@material-ui/icons'

export default function inbox() {
  const [userId, setUserId] = useState('')
  const [user, setUser] =useState(null)
  const [friendRequestsList, setFriendRequestsList] = useState([])
  const [isCleared, setIsCleared] = useState(false)
  const [isAccept, setIsAccept] = useState(false)
  useEffect(() => {
    setUserId(getCookieUserId)
    if (userId) {
      reqUserProfile(userId)
      .then(res=>setUser(res.data), err=>console.log(err))
      reqGetInbox(userId)
        .then(
          res => {
            const receivedList = res.data.items
            const requestsList = []
            receivedList.forEach(element => {
              if (element.type === 'follow') {
                requestsList.push(element)
              }
            });
            
            setFriendRequestsList(requestsList)
          },
          err => {
            console.log(err);
            alert(err)
          }
        )

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
  if (friendRequestsList.length === 0) {
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
            <div key={request.actor.id}>
              <FriendRequest
                id={request.actor.id}
                displayName={request.actor.display_name}
                profileImage={request.actor.profile_image}
                acceptAction={() => handleAcceptRequest(request)}
                refuseAction={() => handleRefuseRequest} />
            </div>
          ))}

        </div>
      </div>
    )
  }
}
