import axios from 'axios'
import React, { useEffect, useState } from 'react'
import TopNavigation from '../TopNavigation';
import { getTime } from '../../components/common';
import { AddComment, ExpandLess, ExpandMore, Favorite, Done, Close, Share } from '@material-ui/icons';
import Markdown from 'markdown-to-jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getCookieUserId } from '../../components/utils/cookieStorage';
import { reqGetFollowersList, reqPostToInbox, reqUserProfile } from '../../api/Api';
import { v4 as uuidv4 } from 'uuid';
import { reqGetAuthorsList, reqGetUserPosts } from '../../api/Api';
import { getUserIdFromUrl } from '../../components/common';
import followerStyle from '../styles.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [isPopup, setIsPopup] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const [localUser, setLocalUser] = useState(null)
  const [authorComment, setComments] = useState('')
  const [clickedPostId, setClickedPostId] = useState('')
  const [postForShare, setPostForShare] = useState(null)
  const [isSharing, setIsSharing] = useState(false)
  const [followers, setFollowers] = useState([])

  useEffect(() => {
    async function fetchPosts() {
      reqUserProfile(getCookieUserId()).then(
        res => setLocalUser(res.data)
      )
      const response = await reqGetAuthorsList();
      if (response.status >= 200 && response.status < 300) {
        let users = response.data.items;
        users = users.filter(author => author.host === "https://floating-fjord-51978.herokuapp.com")
        const posts = await Promise.all(
          users.map(async (user) => {
            const response = await reqGetUserPosts(getUserIdFromUrl(user.id));
            if (response.status >= 200 && response.status < 300) {
              let posts = response.data.items
              posts = posts.filter(post => post.visibility === "PUBLIC")
              posts.sort((a, b) => new Date(b.published) - new Date(a.published))
              return posts.map((post) => ({ ...post, user }));
            } else {
              console.log('====================================');
              console.log("fail to fetch posts", response);
              console.log('====================================');
            }
          })
        );
        const postsWithLikes = await Promise.all(posts.flat().map(async (post) => {
          const likesResponse = await axios({
            url: `${post.id}/likes`,
            method: 'get',
            auth: {
              username: 'admin',
              password: 'admin'
            }
          });
          const likesData = likesResponse.data ? likesResponse.data.items : []
          setIsLoading(false)
          return { ...post, likelength: likesData.length };
        }));

        setPosts(postsWithLikes);
        // setPosts(posts.flat());

      } else {
        console.log('====================================');
        console.log("fail to fetch authors", response);
        console.log('====================================');
      }
    }
    fetchPosts();
  }, []);

  async function handleExpandComments(post) {
    const response = await axios({
      url: `${post.id}/comments`,
      method: 'get',
      auth: {
        username: 'admin',
        password: 'admin'
      }
    });
    const comments = response.data.items;
    setSelectedPost((prevSelectedPost) => ({
      ...prevSelectedPost,
      comments,
    }));
    setExpandedPosts((prevExpandedPosts) => [...prevExpandedPosts, post.id]);
  }

  function handleCollapseComments(postId) {
    setSelectedPost(null);
    setExpandedPosts((prevExpandedPosts) => prevExpandedPosts.filter((id) => id !== postId));
  }

  const handleComment = (post) => {
    setIsPopup(true)
    setCurrentPost(post)
  }
  const handlePostComment = () => {
    const data = {
      type: 'comment',
      author: localUser,
      comment: authorComment,
      contentType: 'text/plain',
      id: `${currentPost.id}/comments/${uuidv4()}`,
      published: new Date().toISOString()
    }
    axios({
      url: `${currentPost.author.id}/inbox`,
      method: 'post',
      data,
      auth: {
        username: 'admin',
        password: 'admin'
      }
    }).then(res => { setIsPopup(false) })
  }

  const handleLike = (post) => {
    const data = {
      type: 'like',
      author: localUser,
      summary: `${localUser.displayName} liked your post`,
      object: post.id
    }
    axios({
      url: `${post.author.url}/inbox`,
      method: 'post',
      data,
      auth: {
        username: 'admin',
        password: 'admin'
      }
    }).then(res => {
      setClickedPostId(post.id)
    })
  }

  const handleShare = (post) => {
    setPostForShare(post)
    setIsSharing(true)
    reqGetFollowersList(getUserIdFromUrl(post.author.id))
      .then(res => {
        setFollowers(res.data.items);
      }, err => console.log(err))
  }

  const sharePost = (follower) => {
    if (follower.id.includes("https://floating-fjord-51978.herokuapp.com/")) {
      reqPostToInbox(postForShare, getUserIdFromUrl(follower.id))
        .then(res => {
          setIsSharing(false);
          toast.success("Shared!", { position: toast.POSITION.CENTER })
        })
    } else if (follower.id.includes("https://distributed-social-net.herokuapp.com")) {
      axios({
        url: `${follower.id}/inbox/`,
        method: 'post',
        data: postForShare,
        auth: {
          username: 'cmput404_team18',
          password: "cmput404_team18"
        }
      }).then(res => {
        setIsSharing(false);
        toast.success("Shared!", { position: toast.POSITION.CENTER })
      })
    }
  }

  return (
    <div>
      <TopNavigation></TopNavigation>
      <ToastContainer position={toast.POSITION.CENTER} />
      {isSharing && (
        <div className="fixed w-screen h-screen opacity-80 bg-black z-30" onClick={() => setIsSharing(false)}></div>
      )}
      {isSharing && (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/2 z-50 rounded-md bg-white"
        >
          <div className='flex justify-between border-b border-gray-200 m-5'>
            <h2 className="text-base font-semibold mb-2">Followers</h2>
            <span className='cursor-pointer' onClick={() => setIsSharing(false)}><Close /></span>
          </div>
          <ul className='ml-5 w-11/12 h-3/4 overflow-y-scroll'>
            {followers.map((follower) => (
              <div key={follower.id} onClick={() => sharePost(follower)}>
                <li className={followerStyle.follower}>
                  <div className='flex flex-row'>
                    <img className='mr-4 w-10 h-10 rounded-full' src={follower.profileImage ? follower.profileImage : 'defaultUser.png'} />
                    <p>{follower.displayName}</p>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </div>
      )}
      {isPopup && (
        <div>
          <div className="fixed w-screen h-screen opacity-80 bg-black z-30" onClick={() => setIsPopup(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 bg-white h-1/4 z-40 rounded-md">
            <div className='text-left h-4/5 px-5 py-2'>
              <textarea className='text-sm font-normal text-gray-500 resize-none outline-none w-full h-full' placeholder='Write your comments here' onChange={(e) => setComments(e.target.value)}></textarea>
            </div>
            <div className='flex justify-end items-center mx-5 mb-4 h-1/5'>
              <Done fontSize='large' className='pr-3 cursor-pointer' onClick={() => handlePostComment()} />
              <Close className='cursor-pointer' onClick={() => setIsPopup(false)} />
            </div>
          </div>
        </div>
      )}
      {isLoading ? <LoadingSpinner></LoadingSpinner> :
        <div className='w-2/3 mx-auto pt-20'>
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded shadow-md p-5 my-5">
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
              {(post.contentType === "image/jpeg;base64" || post.contentType === "image/png;base64" || post.contentType === "application/base64") ? <img src={post.content}></img> :
                <p>{post.contentType === "text/plain" ? post.content : <Markdown>{post.content}</Markdown>}</p>
              }
              {expandedPosts.includes(post.id) ? (
                <div>
                  <div className='flex flex-row items-center mt-3'>
                    {clickedPostId === post.id ?
                      <div className='flex flex-row items-center mr-1'>
                        <Favorite fontSize='small' className='cursor-pointer mr-1 text-red-600' onClick={() => handleLike(post)} />
                        <p className='text-xs  mr-2 text-gray-500'>{post.likelength + 1}</p>
                      </div>
                      : <div className='flex flex-row items-center mr-1'>
                        <Favorite fontSize='small' className='cursor-pointer mr-1 text-gray-300' onClick={() => handleLike(post)} />
                        <p className='text-xs  mr-2 text-gray-500'>{post.likelength}</p></div>}
                    <AddComment fontSize='small' className="cursor-pointer mr-2 text-gray-300" onClick={() => handleComment(post)} />
                    <Share fontSize='small' className="cursor-pointer mr-2 text-gray-300" onClick={() => handleShare(post)}></Share>
                    <ExpandLess className='text-right cursor-pointer text-gray-300' onClick={() => handleCollapseComments(post.id)}></ExpandLess>
                  </div>
                  {selectedPost && selectedPost.comments.length > 0 && selectedPost.comments[0].id.includes(post.id) && (
                    <div>
                      {selectedPost.comments.map((comment) => (
                        <div key={comment.id} className='flex flex-row justify-between text-xs my-1 rounded-sm bg-gray-100 p-1'>
                          <p><span className='font-semibold'>{comment.author.displayName}: </span>{comment.comment}</p>
                          <p>{getTime(comment.published)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className='flex flex-row items-center mt-3'>
                  {clickedPostId === post.id ?
                    <div className='flex flex-row items-center mr-1'>
                      <Favorite fontSize='small' className='cursor-pointer mr-1 text-red-600' onClick={() => handleLike(post)} />
                      <p className='text-xs  mr-2 text-gray-500'>{post.likelength + 1}</p>
                    </div>
                    : <div className='flex flex-row items-center mr-1'>
                      <Favorite fontSize='small' className='cursor-pointer mr-1 text-gray-300' onClick={() => handleLike(post)} />
                      <p className='text-xs  mr-2 text-gray-500'>{post.likelength}</p></div>}
                  <AddComment fontSize='small' className="cursor-pointer mr-2 text-gray-300" onClick={() => handleComment(post)} />
                  <Share fontSize='small' className="cursor-pointer mr-2 text-gray-300" onClick={() => handleShare(post)}></Share>
                  <ExpandMore className=' cursor-pointer text-gray-300' onClick={() => handleExpandComments(post)}></ExpandMore>
                </div>
              )}
            </div>
          ))}
        </div>}
    </div>
  );
}

export default Posts;
