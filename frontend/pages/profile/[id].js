import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import TopNavigation from '../TopNavigation'
import Link from 'next/link'
import Image from "next/image"
import { reqUserProfile, reqUserId } from '../../api/Api'
import { getCookieUserId } from '../../components/utils/cookieStorage'

// export async function getServerSideProps({ params }) {
//   const { id } = params;
//   console.log(id);
//   let user = null;
//   try {
//     const res = await reqUserProfile(id);
//     user = {
//       display_name: res.data.display_name,
//       github: res.data.github,
//       profile_page: res.data.profile_page
//     }
//   } catch (err) {
//     console.log(err);
//   }
//   return {
//     props: {
//       user
//     }
//   };
// }

export default function UserProfile() {
  const router = useRouter()
  const { id } = router.query
  // console.log(id);
  const [user, setUser] = useState(null)
  useEffect(() => {
    if (id) {
      reqUserProfile(id)
        .then(
          res => {
            setUser(res.data);
          },
          err => {
            console.log(err);
          }
        )
    }
  }, [id])

  const goBack = () => {
    router.back();
  }

  const handleFollow = () => {
    // handle follow here
  }

  if (!user) {
    return (
      <div>
        {console.log(user)}

        <TopNavigation />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {/* {console.log(user)} */}
      <TopNavigation />
      <button onClick={goBack} className="absolute top-0 left-0 mt-24 px-3 py-1 ml-10 rounded-md bg-gray-100 text-sm">← Back</button>
      <div className="mt-24 container max-w-2xl mx-auto flex-col items-center justify-center px-2">
        <div className="bg-lighter px-10 h-4/5 rounded-xl shadow-xl text-main w-full relative">
          <button onClick={handleFollow} className='absolute top-5 right-3 rounded-md px-5 py-2 transition-all duration-200 ease-in-out text-white text-base' style={{background:"#008CBA"}}>Follow</button>
          <div>
            <div className='w-28 h-28 my-10 mx-auto'>
              <img className='w-28 h-28 rounded-full border-2 border-gray-100' src={user.profile_image ? user.profile_image : "../defaultUser.png"} alt="User" />
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-3xl font-bold leading-none tracking-tighter mb-5">Username</h2>
              <p className="text-content ml-8 h-10 font-bold">{user.username == '' ? 'test username' : user.display_name}</p>
            </div>
            <div className="items-center justify-between mb-8">
              <h2 className="text-3xl font-bold leading-none tracking-tighter mb-5">Github</h2>
              <a><p className="text-content ml-8 h-10 font-bold">{user.github == '' ? 'test github' : user.github}</p></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default UserProfile;
