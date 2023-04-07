import axios from 'axios'
import React, { useEffect, useState } from 'react'
import TopNavigation from './TopNavigation';
import { getTime } from '../components/common';
import { AddComment, ExpandLess, ExpandMore, Favorite, Done, Close } from '@material-ui/icons';
import Markdown from 'markdown-to-jsx'
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCookieUserId } from '../components/utils/cookieStorage';
import { reqUserProfile } from '../api/Api';
import { v4 as uuidv4 } from 'uuid';

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
  const foreign_host1 = "https://distributed-social-net.herokuapp.com"
  const foreign_host2 = "https://cmput404-group-project.herokuapp.com"

  useEffect(() => {
    async function fetchPosts() {
      reqUserProfile(getCookieUserId()).then(
        res => setLocalUser(res.data)
      )
      const response = await axios({
        url: `${foreign_host1}/service/authors`,
        method: 'get',
        auth: {
          username: 'cmput404_team18',
          password: 'cmput404_team18'
        }
      })
      if (response.status >= 200 && response.status < 300) {
        let users = response.data.items;
        users = users.filter(author => author.host.includes("https://distributed-social-net.herokuapp.com/service/authors/"))
        const posts_ = await Promise.all(
          users.map(async (user) => {
            const response = await axios({
              url: `${user.id}/posts`,
              method: 'get',
              auth: {
                username: 'cmput404_team18',
                password: 'cmput404_team18'
              }
            });
            if (response.status >= 200 && response.status < 300) {
              let posts = response.data.items
              posts = posts.filter(post => post.visibility === "PUBLIC")
              if (posts >= 50) {
                posts = posts.slice(0,50)
              }
              return posts.map((post) => ({ ...post, user }));
            } else {
              console.log('====================================');
              console.log("fail to fetch posts from group 18", response);
              console.log('====================================');
            }
          })
        );
        
        let postsWithLikes = await Promise.all(posts_.flat().map(async (post) => {
          const likesResponse = await axios({
            url: `${post.id}/likes`,
            method: 'get',
            auth: {
              username: 'cmput404_team18',
              password: 'cmput404_team18'
            }
          });
          const likesData = likesResponse.data ? likesResponse.data.items : []
          return { ...post, likelength: likesData.length };
        }));
        const response2 = await axios({
          url:`${foreign_host2}/service/authors/`,
          method:'get',
          auth: {
            username:'remote',
            password:'remote'
          }
        })
        if (response2.status >= 200 && response2.status < 300) {
          let users = response2.data.items
          users = users.filter(author => author.host.includes("cmput404-group-project.herokuapp.com"))
          const posts_ = await Promise.all(
            users.map(async (user) => {
              const response = await axios({
                url: `${user.id}posts/`,
                method: 'get',
                auth: {
                  username: 'remote',
                  password: 'remote'
                }
              });
              if (response.status >= 200 && response.status < 300) {
                let posts = response.data
                posts = posts.filter(post => post.visibility === "PUBLIC")
                if (posts.length >= 50) {
                  posts = posts.slice(0,50)
                }
                return posts.map((post) => ({ ...post, user }));
              } else {
                console.log("fail to fetch posts from group 22", response);
              }
            })
          );
          let postsWithLikes2 = await Promise.all(posts_.flat().map(async (post) => {
            const likesResponse = await axios({
              url: `${post.id}likes/`,
              method: 'get',
              auth: {
                username: 'remote',
                password: 'remote'
              }
            });
            const likesLength = likesResponse.data ? likesResponse.data.count : []
            setIsLoading(false)
            return { ...post, likelength: likesLength };
          }));
          postsWithLikes.push(...postsWithLikes2)
          setPosts(postsWithLikes);
        }
        // setPosts(currentposts);
        // setPosts(posts.flat());

      } else {
        console.log("fail to fetch authors from group 22", response);
      }
    }
    fetchPosts();
  }, []);

  async function handleExpandComments(post) {
    const response = await axios({
      url: `${post.id}/comments`,
      method: 'get',
      auth: {
        username: 'cmput404_team18',
        password: 'cmput404_team18'
      }
    });
    const comments = response.data.comments;
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
      id: `${currentPost.id}/comments/${uuidv4()}`
    }
    axios({
      url: `${currentPost.author.id}/inbox/`,
      method: 'post',
      data,
      auth: {
        username: 'cmput404_team18',
        password: 'cmput404_team18'
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
      url: `${post.author.url}/inbox/`,
      method: 'post',
      data,
      auth: {
        username: 'cmput404_team18',
        password: 'cmput404_team18'
      }
    }).then(res => {
      setClickedPostId(post.id)
    })
  }
  return (
    <div>
      <TopNavigation></TopNavigation>
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
                      <div className='flex flex-row items-center'>
                        <Favorite fontSize='small' className='cursor-pointer mr-2 text-red-600' onClick={() => handleLike(post)} />
                        <p className='text-xs  mr-2 text-gray-500'>{post.likelength + 1}</p>
                      </div>
                      : <div className='flex flex-row items-center'>
                        <Favorite fontSize='small' className='cursor-pointer mr-2 text-gray-300' onClick={() => handleLike(post)} />
                        <p className='text-xs  mr-2 text-gray-500'>{post.likelength}</p></div>}
                    <AddComment fontSize='small' className="cursor-pointer mr-2 text-gray-300" onClick={() => handleComment(post)} />
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
                      <div className='flex flex-row items-center'> 
                        <Favorite fontSize='small' className='cursor-pointer mr-2 text-red-600' onClick={() => handleLike(post)} />
                        <p className='text-xs  mr-2 text-gray-500'>{post.likelength + 1}</p>
                      </div>
                      : <div className='flex flex-row items-center'>
                        <Favorite fontSize='small' className='cursor-pointer mr-2 text-gray-300' onClick={() => handleLike(post)} />
                        <p className='text-xs  mr-2 text-gray-500'>{post.likelength}</p></div>}
                  <AddComment fontSize='small' className="cursor-pointer mr-2 text-gray-300" onClick={() => handleComment(post)} />
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
