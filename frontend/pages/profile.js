import { React, useState } from 'react'
// import profileStyle from '../styles/profile.module.css'
// import signupStyle from '../pages/signup/signup.module.css'
export default function profile() {

  const username = useState('');
  const email = useState('');
  const password = useState('');
  const likes = useState('');
  const followers = useState('');

  // const { container, left, middle, right, userPhoto, editButton } = profileStyle;
  // const { title } = signupStyle;
  function editProfile() {
    console.log('edit');
  }
  return (
    <div className='flex flex-row my-8 mx-10'>
      <div className="w-1/3">
        <h1 className="text-2xl font-semibold mb-5">My Profile</h1>
        <p>Followers:<span>{followers}</span></p>
        <p>Likes:<span>{likes}</span></p>
      </div>
      <div className="w-2/5">
        <div className='text-center'>
          <img className="w-52 h-52 rounded-full m-5" src="" alt="" />
          <ul>
            <li><span>Username: </span></li>
            <li><span>Email: </span></li>
            <li><span>Password: </span></li>
          </ul>
          <button className="bg-gray-200 mt-10 py-1 px-3" onClick={editProfile}>edit profile</button>
        </div>
      </div>
      <div>
        
      </div>
    </div>
  )
}
