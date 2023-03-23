import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { clearInfo } from '../components/utils/cookieStorage';
const TopNavigation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${searchTerm}`);
    }
  };

  const handleToggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const handleLogout = () => {
    clearInfo();
    router.replace('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 px-4 py-3">
      <div className="flex justify-between">
        <div>
          <Link href="/inbox">
            <a className="text-white hover:text-gray-400 font-semibold text-lg">My App</a>
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
                placeholder="Search"
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
  );
};

export default TopNavigation;
