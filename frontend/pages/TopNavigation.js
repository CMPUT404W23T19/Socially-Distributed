import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { clearInfo } from '../components/utils/cookieStorage';
import { reqGetAuthorsList } from '../api/Api';
import { getUserIdFromUrl } from '../components/common';
import { Close } from '@material-ui/icons';

const TopNavigation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [authorsList, setAuthorsList]= useState([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const router = useRouter();
  useEffect(() => {
    reqGetAuthorsList()
    .then(
      res => setAuthorsList(res.data.items),
      err => console.log(err)
    )
  },[])

  const handleSearch = async (e) => {
    e.preventDefault();
    const authorsIdList = authorsList.map(elem => getUserIdFromUrl(elem.id).toString())
    if (authorsIdList.includes(searchTerm.trim())) {
      router.replace(`/profile/${searchTerm.trim()}`);
    } else {
      setIsPopupOpen(true)
      // alert('no such user')
    }
  };

  const handleToggleNotification = () => {
    setShowNotification(!showNotification);
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
          <div className="fixed w-screen h-screen opacity-80 bg-black z-30" onClick={() => togglePopup}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/4 z-40 rounded-md bg-gray-800 text-white">
            <div className='flex justify-between m-5'>
              <h2 className="text-base font-semibold mb-2">BAD FRIEND ID ENTERED</h2>
              <span className='cursor-pointer' onClick={() => togglePopup}><Close /></span>
            </div>
            <div className='text-left m-5'>
              <p className='text-sm font-normal text-gray-100'>The ID you entered does not exists. Please check the ID of your friend and try again.</p>
            </div>
          </div>
        </div>
      )}
      <nav className="fixed top-0 left-0 right-0 z-20 bg-gray-800 px-4 py-3">
      <div className="flex justify-between">
        <div>
          <Link href="/inbox">
            <a className="text-white hover:text-gray-400 font-semibold text-lg">Inbox</a>
          </Link>
            <Link href="/profile">
              <a className="block text-white hover:text-gray-400 lg:inline-block mt-4 lg:mt-0 mr-10 ml-10">Profile</a>
            </Link>
            <Link href="/post">
              <a className="block text-white hover:text-gray-400 lg:inline-block mt-4 lg:mt-0 mr-10">Posts</a>
            </Link>
            <Link href="/createPost">
              <a className="block text-white hover:text-gray-400 lg:inline-block mt-4 lg:mt-0 mr-10">Create a post</a>
            </Link>
        </div>
        <div className="flex">
          <div className="relative mr-4">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search Friend ID"
                className="bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-3 mr-3"
              >
                {/* search */}
              </button>
            </form>
          </div>
          <button
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
          </button>
          <button onClick={handleLogout} className="relative text-white hover:text-gray-400 ml-5 pl-5 border-l-2 border-white">Logout</button>
        </div>
      </div>
    </nav>
    </div>
  );
};

export default TopNavigation;
