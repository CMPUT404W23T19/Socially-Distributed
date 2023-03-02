import { React, useState } from 'react'
import profileStyle from '../styles/profile.module.css'
import signupStyle from '../pages/signup/signup.module.css'
export default function profile() {

  const username = useState('');
  const email = useState('');
  const password = useState('');
  const likes = useState('');
  const followers = useState('');

  const { container, left, middle, right, userPhoto, editButton } = profileStyle;
  const { title } = signupStyle;
  function editProfile() {
    console.log('edit');
  }
  return (
    <div className={container}>
      <div className={left}>
        <h1 className={title}>My Profile</h1>
        <p>Followers:<span>{followers}</span></p>
        <p>Likes:<span>{likes}</span></p>
      </div>
      <div className={middle}>
        <div className={userPhoto}>
          <img className={userPhoto} src="" alt="" />
          <ul>
            <li><span>Username: </span></li>
            <li><span>Email: </span></li>
            <li><span>Password: </span></li>
          </ul>
          <button className={editButton} onClick={editProfile}>edit profile</button>
        </div>
      </div>
      <div className={right}>
        
      </div>
    </div>
  )
}
