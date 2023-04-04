import React from 'react'
import { Done, Close } from '@material-ui/icons';
const FriendRequest = ({ id, displayName, profileImage, acceptAction, refuseAction }) => {
  return (
    <div className='w-full pl-8 py-2'>
      {/* <Link href={`/profile/${userId}`}> */}
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center'>
          <img className='mr-4 w-10 h-10 rounded-full' src={profileImage ? profileImage : '../defaultUser.png'} />
          <div className='flex flex-col'>
            <p className='font-semibold mb-1'>{displayName} <span className='font-normal text-xs'>wants to follow you</span></p>
            <span className='font-normal text-xs'>id: {id}</span>
          </div>
        </div>
        <div className='flex flex-row items-center'>
          <Done fontSize='large' className='pr-3 cursor-pointer text-green-600' onClick={() => acceptAction()} />
          <Close className='cursor-pointer text-red-600 mr-5' onClick={() => refuseAction()} />
        </div>
      </div>
      {/* </Link> */}
    </div>
  )
}
export default FriendRequest