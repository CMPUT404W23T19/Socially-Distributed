import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopNavigation from '../TopNavigation';
import { reqGetAuthorsList, reqGetComments, reqGetUserPosts, reqPostComments, reqPostToInbox, reqUserProfile } from '../../api/Api';
import Link from 'next/link';
import { getPostIdFromCommentUrl, getPostIdFromUrl, getTime } from '../../components/common';
import { getUserIdFromUrl } from '../../components/common';
import { Close, Done, Favorite, AddComment, ExpandMore, ExpandLess } from '@material-ui/icons';
import { getCookieUserId, getJWTToken } from '../../components/utils/cookieStorage';
import { v4 as uuidv4 } from 'uuid';
import Markdown from 'markdown-to-jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Feed = () => {
  const [comments, setComments] = useState([]);
  const [postsList, setPostsList] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [localUser, setLocalUser] = useState(null);
  const [userId, setUserId] = useState('')
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    reqUserProfile(getCookieUserId())
      .then(res => { setLocalUser(res.data); setUserId(res.data.id) }, err => console.log(err))

    if (localUser) {
      reqGetAuthorsList()
        .then(res => {
          let authors = res.data.items;
          const promises = authors.map(author => {
            let userId = getUserIdFromUrl(author.id);
            return reqGetUserPosts(userId)
          });
          Promise.all(promises)
            .then(results => {
              let posts = results.flatMap(res => res.data.items);
              posts = posts.filter(post => post.visibility === "PUBLIC")
              posts.sort((a, b) => {
                return new Date(b.published) - new Date(a.published)
              })
              setPostsList(posts);
              const promises2 = posts.map(post => {
                return reqGetComments(getUserIdFromUrl(post.author.id), getPostIdFromUrl(post.id))
              })
              Promise.all(promises2)
                .then(res => {
                  let comments = res.flatMap(res => res.data.items);
                  comments.sort((a, b) => {
                    return new Date(b.published) - new Date(a.published)
                  })
                  setAllComments(comments)
                  setIsLoading(false)
                })
            },
              err => console.log(err))

        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [userId]);

  const handleLike = (post) => {
    // handle like logic here
    const data = {
      type: 'like',
      summary: `${localUser.displayName} liked your post - ${post.title}`,
      author: localUser,
      object: post.id
    }
    axios({
      url: `${post.author.url}/inbox`,
      method: "post",
      data,
      auth: {
        username:'admin',
        password:'admin'
      }
    }).then(res => {
      setIsLiked(true)
      console.log('successful like to inbox')
    }, err => console.log('failed to post like to inbox', err))
    // reqPostToInbox(data, getUserIdFromUrl(post.author.id))
    // .then(res => console.log('successful like to inbox'), err => console.log('failed to post like to inbox',err))
  };

  const handleComment = (post) => {
    // handle comment logic here
    setIsPopupOpen(true)
    setCurrentPost(post)
  };

  const handlePostComment = () => {
    // handle comment logic here
    // parameters: data object, authorId, postId
    // i.e. authorId: 10, postId: e456fa2f-3afd-47ee-8b02-cc417dd09a36

    const data = {
      type: 'comment',
      author: localUser,
      comment: comments,    //################################## a length limit?
      contentType: "text/plain",
      published: new Date().toISOString(),
      id: `${currentPost.id}/comments/${uuidv4()}`
    }
    const authorId = getUserIdFromUrl(currentPost.author.id);

    const postId = getPostIdFromUrl(currentPost.id);
    // reqPostComments(data, authorId, postId)
    //   .then(
    //     res => {
    //       setIsPopupOpen(false);
    //       console.log('successful comment')
    //     },
    //     err => console.log('failed comment', err)
    //   )
    // axios({
    //   url: `${currentPost.id}/comments`,
    //   method: 'post',
    //   data,
    //   headers: {
    //     Authorization: `Bearer ${getJWTToken()}`,
    //   }
    // }).then(res => console.log('good'), err => console.log('bad', err))
    reqPostToInbox(data, authorId)
      .then(res => {
        setIsPopupOpen(false)
        console.log('successful comment to inbox')
      }, err => console.log('fail to comment to inbox', err))
  }
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }

  return (
    <div>
      {isLoading ? <div>
        <TopNavigation></TopNavigation>
        <LoadingSpinner></LoadingSpinner>
      </div> : (
        <div className="container bg-gray-100">
          <TopNavigation />
          {isPopupOpen && (
            <div>
              <div className="fixed w-screen h-screen opacity-80 bg-black z-30" onClick={() => togglePopup()}></div>
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 bg-white h-1/4 z-40 rounded-md">
                <div className='text-left h-4/5 px-5 py-2'>
                  <textarea className='text-sm font-normal text-gray-500 resize-none outline-none w-full h-full' placeholder='Write your comments here' onChange={(e) => setComments(e.target.value)}></textarea>
                </div>
                <div className='flex justify-end items-center mx-5 mb-4 h-1/5'>
                  <Done fontSize='large' className='pr-3 cursor-pointer' onClick={() => handlePostComment()} />
                  <Close className='cursor-pointer' onClick={() => togglePopup()} />
                </div>
              </div>
            </div>
          )}
          <div className='w-2/3 mx-auto pt-20'>
            {postsList.map(post => (
              post.visibility === 'PUBLIC' &&
              <div key={post.id} className="bg-white rounded shadow-md p-5 my-5">
                <div className='cursor-pointer w-auto'>
                  <Link href="/profile/[id]" as={`/profile/${getUserIdFromUrl(post.author.id)}`}>
                    <div>
                      <div className='flex justify-between'>
                        <div className="flex items-center mb-3">
                          <img src={post.author.profileImage ? post.author.profileImage : '../defaultUser.png'} alt="" className="w-8 h-8 rounded-full mr-2" />
                          <h2 className="text-lg font-semibold">{post.author.displayName}</h2>
                        </div>
                        <div>
                          <span className='text-gray-600 text-sm'>{getTime(post.published)}</span>
                        </div>
                      </div>
                      <p className="text-base mb-3 font-semibold pb-1 border-b border-gray-200 text-gray-600">{post.title}</p>
                    </div>
                  </Link>
                </div>
                {(post.contentType === "image/jpeg;base64" || post.contentType === "image/png;base64" || post.contentType === "application/base64") ? <img src={post.content}></img> :
                  <p>{post.contentType === "text/plain" ? post.content : <Markdown>{post.content}</Markdown>}</p>
                }
                <div className="flex justify-between">
                  <div className="flex items-center">
                    {isLiked ? <Favorite className='cursor-pointer pr-2 text-red-600'></Favorite> :<Favorite className='cursor-pointer pr-2 text-gray-300' onClick={() => handleLike(post)} />}
                    <AddComment fontSize='small' className="cursor-pointer text-gray-300" onClick={() => handleComment(post)} />
                  </div>
                  <button onClick={() => setIsCollapsed(!isCollapsed)}>{isCollapsed ? <ExpandMore /> : <ExpandLess />}</button>
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
        </div >
      )}
    </div>
  );
};

export default Feed;
