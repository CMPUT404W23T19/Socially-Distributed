import React, { useEffect, useState } from 'react'
import TopNavigation from '../TopNavigation'
import SideNav from '../../components/SideNav'
import { getCookieUserId } from '../../components/utils/cookieStorage'
import { reqGetMyPosts } from '../../api/Api'
export default function Public() {
  const [userId, setUserId] = useState('')
  const [myPostList, setMyPostList] = useState([])
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      setUserId(getCookieUserId);
      if (userId !== '') {
        try {
          const res = await reqGetMyPosts(userId);
          if (res.status === 200) {
            setMyPostList(res.data.items)
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  },[userId])

  const handleLike = (postId) => {
    // handle like logic here
  };

  const handleComment = (postId) => {
    // handle comment logic here
  };

  const toggleComments = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div>
      <TopNavigation />
      <SideNav />
      <div className='mt-20 ml-40'>
        {console.log(myPostList)}
        {myPostList.map(post => (
          post.visibility === "PUBLIC" && (
            <div key={post.id} className="bg-white rounded-lg shadow-lg p-5 my-5">
              <div className="flex items-center mb-3">
                <img src={post.author.profile_image} alt="" className="w-8 h-8 rounded-full mr-2" />
                <h2 className="text-lg font-bold">{`User ${post.author.display_name}`}</h2>
              </div>
              <p className="text-base mb-3">{post.content}</p>
              <div className="flex justify-between">
                <div className="flex">
                  <button className="bg-gray-200 rounded-lg px-4 py-2 mr-3 hover:bg-gray-300" onClick={() => handleLike(post.id)}>Like</button>
                  <button className="bg-gray-200 rounded-lg px-4 py-2 hover:bg-gray-300" onClick={() => handleComment(post.id)}>Comment</button>
                </div>
                <button className="bg-gray-200 rounded-lg px-4 py-2" onClick={toggleComments}>{isCollapsed ? "Show Comments" : "Hide Comments"}</button>
              </div>
              {/* {comments.filter(comment => comment.postId === post.id && !isCollapsed).length > 0 && (
                <div className="mt-5">
                  <h3 className="text-lg font-bold mb-3">Comments</h3>
                  {comments.filter(comment => comment.postId === post.id).map(comment => (
                    <div key={comment.id} className="bg-gray-200 rounded-lg p-3 my-3">
                      <div className="flex items-center mb-2">
                        <img src={`https://i.pravatar.cc/50?u=${comment.email}`} alt="" className="w-8 h-8 rounded-full mr-2" />
                        <h4 className="text-base font-bold">{comment.name}</h4>
                      </div>
                      <p className="text-base">{comment.body}</p>
                    </div>
                  ))}
                </div>
              )} */}
            </div>)
        ))} 
      </div>
    </div>
  )
}
