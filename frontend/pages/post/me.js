import React, { useEffect, useState } from 'react'
import TopNavigation from '../TopNavigation'
import SideNav from '../../components/SideNav'
import { getCookieUserId } from '../../components/utils/cookieStorage'
import { reqDeletePost, reqGetUserPosts } from '../../api/Api'
import { getTime, getPostIdFromUrl, getUserIdFromUrl } from '../../components/common'
import { useRouter } from 'next/router'
export default function Public() {
  const router = useRouter();
  const [userId, setUserId] = useState('')
  const [myPostList, setMyPostList] = useState([])
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setUserId(getCookieUserId);
      if (userId !== '') {
        try {
          const res = await reqGetUserPosts(userId);
          if (res.status === 200) {
            let posts = res.data.items;
            posts = posts.filter(post => post.visibility === 'PUBLIC')
            posts.sort((a, b) => {
              return new Date(b.published) - new Date(a.published)
            })
            setMyPostList(posts)
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, [userId])

  const toggleComments = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleDeletePost = async (authorId, postId) => {
    const result = confirm('Are you sure to delete this post?')
    if (result) {
      let res = await reqDeletePost(authorId, postId);
      if (res.status>=200 && res.status<=300) {
        console.log('successful deletion');
        setMyPostList(myPostList.filter( post => post.id !== `https://floating-fjord-51978.herokuapp.com/authors/${authorId}/posts/${postId}`))
      } else {
        console.log(res);
      }
    }
  }

  return (
    <div>
      <TopNavigation />
      <SideNav />
      <div className='mt-20 ml-40'>
        {console.log(myPostList)}
        <h2 className='font-bold text-lg mb-3'>My Public Posts</h2>
        {myPostList.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg p-5 my-5">
            <div >
              <div className='flex justify-between'>
                <div className="flex items-center mb-3">
                  <img src={post.author.profileImage ? post.author.profileImage:"../defaultUser.png"} alt="" className="w-8 h-8 rounded-full mr-2" />
                  <h2 className="text-lg font-bold">{post.author.displayName}</h2>
                </div>
                <div>
                  <span>{getTime(post.published)}</span>
                </div>
              </div>
              <p className="text-base mb-3 font-semibold">{post.title}</p>
            </div>
            <p className="text-base mb-3 px-5 w-full">{post.content}</p>
              <div className='flex flex-row'>
                <button className="bg-gray-200 rounded-lg px-2 py-1 mr-3 hover:bg-gray-300" onClick={() => handleDeletePost(getUserIdFromUrl(post.author.id), getPostIdFromUrl(post.id))}>Delete</button>
                <button className="bg-gray-200 rounded-lg px-2 py-1 hover:bg-gray-300" onClick={toggleComments}>{isCollapsed ? "Show Comments" : "Hide Comments"}</button>
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
          </div>
        ))}
      </div>
    </div>
  )
}
