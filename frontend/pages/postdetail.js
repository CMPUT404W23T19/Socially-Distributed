import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getCookieUserId } from '../components/utils/cookieStorage';
import TopNavigation from './TopNavigation';
import { reqUserProfile } from '../api/Api';
import { getUserIdFromUrl, getPostIdFromCommentUrl, getPostIdFromUrl, getTime, parseNestedObject } from '../components/common';
import { Done, Close } from '@material-ui/icons';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getJWTToken } from '../components/utils/cookieStorage';

export default function postdetail() {
  const router = useRouter()
  const post = router.query
  const postAuthor = JSON.parse(post.author)
  const [comments, setComments] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [localUser, setLocalUser] = useState(null);
  const [canShowComment, setCanShowComment] = useState(false)

  useEffect(() => {
    reqUserProfile(getCookieUserId())
      .then(res => setLocalUser(res.data), err => console.log(err))
    if (post.visibility === "PUBLIC") {
      setCanShowComment(true)
      axios({
        url: `${post.id}/comments`,
        method: 'get',
        auth: {
          username: "admin",
          password: "admin"
        }
      }).then(res => setAllComments(res.data.items))
    }
  }, [post])

  const handleLike = (postId) => {
    // handle like logic here

  };

  const handleComment = () => {
    // handle comment logic here
    setIsPopupOpen(true)
  };

  const handlePostComment = () => {
    // handle comment logic here
    // parameters: data object, authorId, postId
    // i.e. authorId: 10, postId: e456fa2f-3afd-47ee-8b02-cc417dd09a36

    const data = {
      author: localUser,
      comment: comments,    //################################## a length limit?
      contentType: "text/markdown",
      published: new Date().toISOString()
    }
    axios({
      url: `${post.id}/comments`,
      method: 'post',
      data,
      headers: {
        Authorization: `Bearer ${getJWTToken()}`,
      }
    }).then(
      res => {
        console.log(res);
        setIsPopupOpen(false);
        console.log('successful comment')
      },
      err => console.log('failed comment', err)
    )

    const commentData = {
      id: `${post.id}/comments/${uuidv4()}`,
      type: "comment",
      author: localUser,
      comment: comments,
      contentType: "text/markdown",
      published: new Date().toISOString(),
    }
    axios({
      url: `${postAuthor.id}/inbox`,
      method: 'post',
      data: commentData,
      auth: {
        username: 'admin',
        password: 'admin'
      }
    })
      .then(
        res => console.log('successfully post a comment'),
        err => console.log('fail to post a comment: ', err)
      )
  }

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }

  return (
    <div className="container">
      <TopNavigation />
      {isPopupOpen && (
        <div>
          <div className="fixed w-screen h-screen opacity-80 bg-black z-30" onClick={() => togglePopup()}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 bg-white h-1/4 z-40 rounded-md">
            <div className='text-left h-4/5 px-5 py-2'>
              <textarea className='text-sm font-normal text-gray-500 resize-none outline-none w-full h-full' placeholder='Write your comments here' onChange={(e) => setComments(e.target.value)}></textarea>
            </div>
            <div className='flex justify-end items-center mx-5 mb-4 h-1/5'>
              <Done fontSize='large' className='pr-3 cursor-pointer text-green-600' onClick={() => handlePostComment()} />
              <Close className='cursor-pointer' onClick={() => togglePopup()} />
            </div>
          </div>
        </div>
      )}
      <div className='pt-20 w-4/5 h-screen mx-auto '>
        <div className="bg-white rounded-lg shadow-lg h-screen p-5 my-5">
          <div className='cursor-pointer w-auto'>
            <div >
              <div className='flex justify-between'>
                <div className="flex items-center mb-3">
                  <img src={postAuthor.profileImage ? postAuthor.profileImage : '../defaultUser.png'} alt="" className="w-8 h-8 rounded-full mr-2" />
                  <h2 className="text-lg font-bold">{postAuthor.displayName}</h2>
                </div>
                <div>
                  <span>{getTime(post.published)}</span>
                </div>
              </div>
              <p className="text-base mb-3 font-semibold">{post.title}</p>
            </div>
          </div>
          <p className="text-base mb-3 px-5">{post.content}</p>
          <div className="flex justify-between">
            <div className="flex">
              <button className="bg-gray-200 rounded-lg px-4 py-2 mr-3 hover:bg-gray-300" onClick={() => handleLike(post)}>Like</button>
              <button className="bg-gray-200 rounded-lg px-4 py-2 hover:bg-gray-300" onClick={() => handleComment()}>Comment</button>
            </div>
            {canShowComment? (<button className="bg-gray-200 rounded-lg px-4 py-2" onClick={() => setIsCollapsed(!isCollapsed)}>{isCollapsed ? "Show Comments" : "Hide Comments"}</button>):
            (<button className="bg-gray-200 rounded-lg px-4 py-2" disabled>Comments Private</button>)}
          </div>
          {allComments.length > 0 && !isCollapsed && (
            <div className="mt-5">
              <h3 className="text-lg font-bold mb-3">Comments</h3>
              {/* .filter(comment => getPostIdFromCommentUrl(comment.id) === getPostIdFromUrl(post.id)) */}
              {allComments.filter(comment => getPostIdFromCommentUrl(comment.id) === getPostIdFromUrl(post.id)).map(comment => (
                <div key={comment.id} className="bg-gray-200 rounded-lg p-3 my-3">
                  <div className="flex items-center mb-2">
                    <img src={`${comment.author.profileImage ? comment.author.profileImage : '../defaultUser.png'}`} alt="" className="w-8 h-8 rounded-full mr-2" />
                    <h4 className="text-base font-bold">{comment.author.displayName}</h4>
                  </div>
                  <p className="text-base">{comment.comment}</p>
                </div>
              )
              )}
            </div>
          )}
        </div>
      </div>
    </div >
  );
}
