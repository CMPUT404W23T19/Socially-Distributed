import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopNavigation from '../TopNavigation';
import SideNav from '../../components/SideNav'
import { reqGetAuthorsList, reqGetComments, reqGetUserPosts, reqPostComments, reqPostToInbox, reqUserProfile } from '../../api/Api';
import Link from 'next/link';
import { getPostIdFromCommentUrl, getPostIdFromUrl, getTime } from '../../components/common';
import { getUserIdFromUrl } from '../../components/common';
import { Close, Done, FavoriteBorder, AddComment } from '@material-ui/icons';
import { getCookieUserId, getJWTToken } from '../../components/utils/cookieStorage';
import { v4 as uuidv4 } from 'uuid';

const Feed = () => {
  const [comments, setComments] = useState([]);
  const [postsList, setPostsList] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [localUser, setLocalUser] = useState(null);
  useEffect(() => {
    reqUserProfile(getCookieUserId())
      .then(res => setLocalUser(res.data), err => console.log(err))

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
            posts = posts.filter(post => post.visibility === "PUBLIC" && post.author.id !== localUser.id)
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
              })
          },
            err => console.log(err))

      })
      .catch(error => {
        console.log(error);
      });
    }
  }, [localUser,comments]);

  const handleLike = (post) => {
    // handle like logic here
    const data = {
      type: 'Like',
      summary: `${localUser.displayName} liked your post`,
      author: localUser,
      object: post.id
    }
    axios({
      url: `${post.author.url}/inbox`,
      method: "post",
      data,
      headers: {
        Authorization: `Bearer ${getJWTToken()}`,

      }
    }).then(res => console.log('successful like to inbox'), err => console.log('failed to post like to inbox', err))
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
      contentType: "text/markdown",
      published: new Date().toISOString(),
      id: `${currentPost.id}/comments/${uuidv4()}`
    }
    const authorId = getUserIdFromUrl(currentPost.author.id);
    console.log(authorId);
    const postId = getPostIdFromUrl(currentPost.id);
    // reqPostComments(data, authorId, postId)
    //   .then(
    //     res => {
    //       setIsPopupOpen(false);
    //       console.log('successful comment')
    //     },
    //     err => console.log('failed comment', err)
    //   )
    axios({
      url: `${currentPost.id}/comments`,
      method: 'post',
      data,
      headers: {
        Authorization: `Bearer ${getJWTToken()}`,
      }
    }).then(res => console.log('good'), err => console.log('bad', err))
    reqPostToInbox(data, authorId)
      .then(res => {
        setIsPopupOpen(false)
        console.log('successful comment to inbox')}, err => console.log('fail to comment to inbox', err))
  }
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen)
  }

  return (
    <div className="container">
      <TopNavigation />
      <SideNav />
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
      <div className='mx-auto pt-10 pl-32'>
        {postsList.map(post => (
          post.visibility === 'PUBLIC' &&
          <div key={post.id} className="bg-white rounded-lg shadow-lg p-5 my-5">
            <div className='cursor-pointer w-auto'>
              <Link href="/profile/[id]" as={`/profile/${getUserIdFromUrl(post.author.id)}`}>
                <div >
                  <div className='flex justify-between'>
                    <div className="flex items-center mb-3">
                      <img src={post.author.profileImage ? post.author.profileImage : '../defaultUser.png'} alt="" className="w-8 h-8 rounded-full mr-2" />
                      <h2 className="text-lg font-bold">{post.author.displayName}</h2>
                    </div>
                    <div>
                      <span>{getTime(post.published)}</span>
                    </div>
                  </div>
                  <p className="text-base mb-3 font-semibold">{post.title}</p>
                </div>
              </Link>
            </div>
            <p className="text-base mb-3 px-5">{post.content}</p>
            <div className="flex justify-between">
              <div className="flex items-center">
                <FavoriteBorder fontSize='large' className='cursor-pointer pr-4 text-gray-300' onClick={() => handleLike(post)} />
                <AddComment fontSize='medium' className="cursor-pointer text-gray-300" onClick={() => handleComment(post)} />
              </div>
              <button className="bg-gray-200 rounded-lg px-4 py-2" onClick={() => setIsCollapsed(!isCollapsed)}>{isCollapsed ? "Show Comments" : "Hide Comments"}</button>
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
        ))}
      </div>
    </div >
  );
};

export default Feed;
