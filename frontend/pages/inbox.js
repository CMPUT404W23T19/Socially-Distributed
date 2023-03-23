import React, { useEffect, useState } from 'react'
import TopNavigation from './TopNavigation'
import { reqGetFollowersList, reqGetInbox, reqPostToInbox } from '../api/Api'
import { getCookieUserId } from '../components/utils/cookieStorage'
import FriendRequest from '../components/common/FriendRequest'
import { getUserIdFromUrl } from '../components/common'
import { reqFollowOthers } from '../api/Api'
export default function inbox() {
  const [userId, setUserId] = useState('')
  const [friendRequestsList, setFriendRequestsList] = useState([])

  useEffect(() => {
    setUserId(getCookieUserId)
    if (userId) {
      reqGetInbox(userId)
        .then(
          res => {
            console.log(res);
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
  }, [userId])


  const handleAcceptRequest = async (request) => {
    const data = {
      id: getUserIdFromUrl(request.object.id) 
      // ######################### e.g. follower's id or following's id, format like, 6 or http://localhost:8000/authors/6 ?
    }
    reqFollowOthers(data, getUserIdFromUrl(request.actor.id), encodeURIComponent(request.object.id))
      .then(
        res => {
          console.log(res);
          // should remove this request from both frontend and backend so that when user refresh page
          // and request to get the inbox list again, this request isn't there any more?
          const data = {
            "type": "follow",
            "summary": `${userId} want to follow ${id}`,
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
          reqPostToInbox(data, id)
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
        {console.log(friendRequestsList.length)}
        <div className='mt-20 w-4/5 h-screen py-3 mx-auto border border-gray-100'>
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
