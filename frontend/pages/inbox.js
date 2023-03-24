import React, { useEffect, useState } from 'react'
import TopNavigation from './TopNavigation'
import { reqGetFollowersList, reqGetInbox, reqPostToInbox, reqClearInbox } from '../api/Api'
import { getCookieUserId } from '../components/utils/cookieStorage'
import FriendRequest from '../components/common/FriendRequest'
import { getUserIdFromUrl } from '../components/common'
import { reqFollowOthers } from '../api/Api'
import Styles from './styles.module.css'

export default function inbox() {
  const [userId, setUserId] = useState('')
  const [friendRequestsList, setFriendRequestsList] = useState([])
  const [isCleared, setIsCleared] = useState(false)

  useEffect(() => {
    setUserId(getCookieUserId)
    if (userId) {
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
    const data = {
      id: getUserIdFromUrl(request.object.id) 
      // ######### follower's id or following's id, format like, 6 or http://localhost:8000/authors/6 ?
    }
    reqFollowOthers(data, getUserIdFromUrl(request.object.id), encodeURIComponent(request.actor.id))
      .then(
        res => {
          console.log(res);
          // should remove this request from both frontend and backend so that when user refresh page
          // and request to get the inbox list again, this request isn't there any more?
          const data = {
            "type": "follow",
            "summary": `${getUserIdFromUrl(request.object.id)} want to follow ${getUserIdFromUrl(request.actor.id)}`,
            actor: request.object,
            object: request.actor
          }
          reqPostToInbox(data, getUserIdFromUrl(request.actor.id))
          .then(
            res => {
              console.log('success');
              console.log(res);
            },
            err => {
              console.log('fail');
              console.log(err);
            }
          )
        },
        err => {
          console.log(err);
        }
      )
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
