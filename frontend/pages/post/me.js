import React, { useEffect, useState } from 'react'
import TopNavigation from '../TopNavigation'
import { getCookieUserId } from '../../components/utils/cookieStorage'
import { reqDeletePost, reqGetUserPosts, reqGetComments } from '../../api/Api'
import { getTime, getPostIdFromUrl, getUserIdFromUrl, getPostIdFromCommentUrl } from '../../components/common'
import { useRouter } from 'next/router'
import Markdown from 'markdown-to-jsx'
import { DeleteOutline, ExpandMore, ExpandLess } from '@material-ui/icons'
export default function Public() {
  const router = useRouter();
  const [userId, setUserId] = useState('')
  const [myPostList, setMyPostList] = useState([])
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [allComments, setAllComments] = useState([])
  useEffect(() => {
    async function fetchData() {
      setUserId(getCookieUserId);
      if (userId !== '') {
        try {
          const res = await reqGetUserPosts(userId);
          if (res.status >= 200 && res.status < 300) {
            let posts = res.data.items;
            posts.sort((a, b) => {
              return new Date(b.published) - new Date(a.published)
            })
            setMyPostList(posts)
            const promises = posts.map(post => {
              return reqGetComments(getUserIdFromUrl(post.author.id), getPostIdFromUrl(post.id))
            })
            console.log('here');
            Promise.all(promises)
              .then(res => {
                console.log(222);
                let comments = res.flatMap(res => res.data.items);
                comments.sort((a, b) => {
                  return new Date(b.published) - new Date(a.published)
                })
                setAllComments(comments)
              })
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, [userId])

  const handleDeletePost = async (authorId, postId) => {
    const result = confirm('Are you sure to delete this post?')
    if (result) {
      let res = await reqDeletePost(authorId, postId);
      if (res.status >= 200 && res.status <= 300) {
        console.log('successful deletion');
        setMyPostList(myPostList.filter(post => post.id !== `https://floating-fjord-51978.herokuapp.com/authors/${authorId}/posts/${postId}`))
      } else {
        console.log(res);
      }
    }
  }

  return (
    <div className='bg-gray-100'>
      <TopNavigation />
      <div className='pt-20 w-2/3 mx-auto'>
        {myPostList.map(post => (
          <div key={post.id} className="bg-white rounded shadow-md p-5 my-5">
            <div>
              <div className='flex justify-between'>
                <div className="flex items-center mb-3">
                  <img src={post.author.profileImage ? post.author.profileImage : "../defaultUser.png"} alt="" className="w-8 h-8 rounded-full mr-2" />
                  <h2 className="text-lg font-semibold">{post.author.displayName}</h2>
                </div>
                <div className='text-right'>
                  <p className='text-gray-600 text-sm'>{getTime(post.published)}</p>
                  <p className='text-gray-600 text-xs'>{post.visibility}</p>

                </div>
              </div>
              <p className="text-base mb-3 font-semibold pb-1 border-b border-gray-200 text-gray-600">{post.title}</p>
            </div>
            {(post.contentType === "image/jpeg;base64" || post.contentType === "image/png;base64" || post.contentType === "application/base64") ? <img src={post.content}></img> :
              <p>{post.contentType === "text/plain" ? post.content : <Markdown>{post.content}</Markdown>}</p>
            }
            <div className='flex flex-row justify-between items-center mb-2'>
              <button className='cursor-pointer pr-4 text-xs text-gray-700'
                onClick={() => handleDeletePost(getUserIdFromUrl(post.author.id), getPostIdFromUrl(post.id))}>
                {post.visibility === "PUBLIC" && <div className='flex flex-row items-center'>
                  <DeleteOutline fontSize='small' />
                  <p>DELETE</p>
                </div>}
              </button>
              <button onClick={() => setIsCollapsed(!isCollapsed)}>{isCollapsed ? <ExpandMore className='text-gray-700' /> : <ExpandLess className='text-gray-700' />}</button>
            </div>
            {allComments.length > 0 && !isCollapsed && (
              <div className="mt-3">
                {allComments.filter(comment => getPostIdFromCommentUrl(comment.id) === getPostIdFromUrl(post.id)).map(comment => (
                  <div key={comment.id} className='flex flex-row justify-between text-xs my-1 rounded-sm bg-gray-100 p-1'>
                    <p><span className='font-semibold'>{comment.author.displayName}: </span>{comment.comment}</p>
                    <p>{getTime(comment.published)}</p>
                  </div>
                )
                )}
              </div>
            )}
            {!allComments.filter(comment => getPostIdFromCommentUrl(comment.id) === getPostIdFromUrl(post.id)).length && !isCollapsed && (
              <div className='text-xs'>No comments yet.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
