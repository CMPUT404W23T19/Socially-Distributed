import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { clearInfo, getCookieUserId } from '../components/utils/cookieStorage';
import { reqGetAuthorsList, reqUserProfile } from '../api/Api';
import { getUserIdFromUrl } from '../components/common';
import { Close } from '@material-ui/icons';
import axios from 'axios';

const TopNavigation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [localUser, setLocalUser] = useState(null)
  const [localId, setLocalId] = useState('')
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false)
  const router = useRouter();
  useEffect(() => {
    setLocalId(getCookieUserId())
    // reqGetAuthorsList()
    //   .then(
    //     res => setAuthorsList(res.data.items),
    //     err => console.log(err)
    //   )
    reqUserProfile(getCookieUserId())
      .then(
        res => setLocalUser(res.data),
        err => console.log(err)
      )
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault();
    let userUrl = searchTerm
    // Todo: need to identify node and use their username and password
    if (localUser.id !== userUrl) {
      let res = ""
      if (userUrl.includes("https://floating-fjord-51978.herokuapp.com")) {
        res = await axios({
          url: `${userUrl}`,
          method: "get",
          auth: {
            username: 'admin',
            password: 'admin'
          }
        })
      }
      else if (userUrl.includes("https://distributed-social-net.herokuapp.com")) {
        res = await axios({
          url: `${userUrl}`,
          method: "get",
          auth: {
            username: 'cmput404_team18',
            password: 'cmput404_team18'
          }
        })
      } else if (userUrl.includes("https://cmput404-group-project.herokuapp.com")) {
        res = await axios({
          url: `${userUrl}`,
          method: "get",
          auth: {
            username: 'remote',
            password: 'remote'
          }
        })
      }

      if (res.status >= 200 && res.status <= 300) {
        let res2 = ""
        if (userUrl.includes("https://floating-fjord-51978.herokuapp.com")) {
          res2 = await axios({
            url: `${userUrl}/inbox`,
            method: 'post',
            data: {
              type: "follow",
              summary: `${localUser.displayName} want to follow ${res.data.displayName}`,
              actor: localUser,
              object: res.data
            },
            auth: {
              username: 'admin',
              password: 'admin'
            }
          })
        } else if (userUrl.includes("https://distributed-social-net.herokuapp.com")) {
          res2 = await axios({
            url: `${userUrl}/inbox/`,
            method: 'post',
            data: {
              type: "Follow",
              summary: `${localUser.displayName} want to follow ${res.data.displayName}`,
              actor: localUser,
              object: res.data
            },
            auth: {
              username: 'cmput404_team18',
              password: "cmput404_team18"
            }
          })
        } else if (userUrl.includes("https://cmput404-group-project.herokuapp.com")) {
          res2 = await axios({
            url: `${userUrl}inbox/`,
            method: 'post',
            data: {
              type: "Follow",
              summary: `${localUser.displayName} want to follow ${res.data.displayName}`,
              actor: localUser,
              object: res.data
            },
            auth: {
              username: 'remote',
              password: "remote"
            }
          })
        }
        if (res2.status >= 200 && res2.status <= 300) {
          console.log('friend request sent');
          setIsSuccessPopupOpen(true)
          setSearchTerm('')
        } else {
          console.log('friend: request failed to send');
          console.log('error:', res2.message);
        }
      } else {
        setIsPopupOpen(true)
      }
    } else {
      setSearchTerm('')
      alert("You can't add yourself! Please enter another id.")
    }
  };

  const handleLogout = () => {
    clearInfo();
    router.replace('/')
  }

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }

  return (
    <div>
      {isPopupOpen && (
        <div>
          <div className="fixed w-screen h-screen opacity-80 bg-black z-30" onClick={() => togglePopup()}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/4 z-40 rounded-md bg-gray-800 text-white">
            <div className='flex justify-between m-5'>
              <h2 className="text-base font-semibold mb-2">BAD FRIEND ID ENTERED</h2>
              <span className='cursor-pointer' onClick={() => togglePopup()}><Close /></span>
            </div>
            <div className='text-left m-5'>
              <p className='text-sm font-normal text-gray-100'>The ID you entered does not exists. Please check the ID of your friend and try again.</p>
            </div>
          </div>
        </div>
      )}
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
      <nav className="fixed top-0 left-0 right-0 z-20 bg-gray-800 px-4 py-3">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <Link href="/inbox">
              <a className="text-white hover:text-gray-400 font-semibold text-lg mr-10">Inbox</a>
            </Link>
            <Link href="/profile">
              <a className="text-white hover:text-gray-400 mt-4 lg:mt-0 mr-10">Profile</a>
            </Link>
            <Link href="/post/public">
              <a className="text-white hover:text-gray-400 mt-4 lg:mt-0 mr-10">Explore</a>
            </Link>
            <Link href="/remote">
              <a className="text-white hover:text-gray-400 mt-4 lg:mt-0 mr-10">Remote</a>
            </Link>
            <Link href="/post/me">
              <a className="text-white hover:text-gray-400 mt-4 lg:mt-0 mr-10">My Posts</a>
            </Link>
            <Link href="/createPost">
              <a className="text-white hover:text-gray-400 mt-4 lg:mt-0 mr-10">New Post</a>
            </Link>
            <Link href="/githubActivity">
              <a className='text-white hover:text-gray-400 mt-4 lg:mt-0 mr-10'>Github Activity</a>
            </Link>
          </div>
          <div className="flex">
            <div className="relative mr-2">
              <form onSubmit={(e) => handleSearch(e)}>
                <input
                  type="text"
                  placeholder="Search Friend ID"
                  className="bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-3 mr-2"
                >
                  {/* search */}
                </button>
              </form>
            </div>
            {/* <button
              onClick={handleToggleNotification}
              className="relative text-white hover:text-gray-400"
            >
              Notifications
              {showNotification && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-400 ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Notification 1</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Notification 2</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Notification 3</a>
                  </div>
                </div>
              )}
            </button> */}
            <button onClick={handleLogout} className="relative text-white hover:text-gray-400 ml-3 mr-3 pl-5 border-l-2 border-white">Logout</button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default TopNavigation;
