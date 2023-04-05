import React, { useEffect, useState, useCallback } from 'react'
import TopNavigation from '../TopNavigation'
import { getCookieUserId } from '../../components/utils/cookieStorage'
import { reqDeletePost, reqGetUserPosts, reqGetComments } from '../../api/Api'
import { getTime, getPostIdFromUrl, getUserIdFromUrl, getPostIdFromCommentUrl } from '../../components/common'
import { useRouter } from 'next/router'
import Markdown from 'markdown-to-jsx'
import { DeleteOutline, ExpandMore, ExpandLess, Edit, Close } from '@material-ui/icons'
import FormField from '../../components/common/FormField'
import axios from 'axios'
import { getJWTToken } from '../../components/utils/cookieStorage'

export default function Public() {
  const router = useRouter();
  const [userId, setUserId] = useState('')
  const [myPostList, setMyPostList] = useState([])
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [allComments, setAllComments] = useState([])
  const [currentPost, setCurrentPost] = useState(null)
  const [isEditting, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [contentType, setContentType] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [content, setContent] = useState('')
  const [imageType, setImageType] = useState('')
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

  const toggleEditWindow = (post) => {
    setCurrentPost(post)
    setIsEditing(true)
  }

  const handleTitleChange = useCallback((event) => {
    setTitle(event.target.value)
  }, [])

  const handleContentChange = useCallback((event) => {
    setContent(event.target.value)
  }, [])

  const handleImageChange = useCallback(event => {
    const file = event.target.files[0]
    if (file.type === "image/jpeg" || file.type === "image/png") {
      setImageType(file.type + ";base64")
    } else {
      setImageType(file.type + "/base64")
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageUrl(reader.result)
    };
  })

  const handleContentTypeChange = useCallback(event => {
    setContentType(event.target.value);
  })

  const handleEditPost = async (e) => {
    e.preventDefault();
    let data = {
      title,
      contentType,
      content,
      source:currentPost.source,
      origin:currentPost.origin,
      description: currentPost.description,
      author: currentPost.author,
      categories: currentPost.categories,
      visibility: currentPost.visibility,
      unlisted: false,
      published: new Date().toISOString()
    }
    if (content && imageUrl) {
      // content += `!["post image"](${imageUrl})`
      data.content = data.content + `!["post image"](${imageUrl})`
      data.contentType = "text/markdown"
      updatePost(data)
    } else if (content) {
      updatePost(data)
    } else if (imageUrl) {
      data.contentType = imageType
      data.content = imageUrl
      updatePost(data)
    }
  }

  const updatePost = async (data) => {
    const res = await axios({
      url: `${currentPost.id}`,
      method: 'put',
      data,
      headers: {
        Authorization: `Bearer ${getJWTToken()}`,
      }
    })
    if (res.status >= 200 && res.status < 300) {
      setIsEditing(false)
    } else {
      console.log('====================================');
      console.log(res);
      console.log('====================================');
      // setIsEditing(false)
    }
  }
  return (
    <div className='bg-gray-100'>
      <TopNavigation />
      {isEditting &&
        <div className='fixed h-screen w-screen z-30 opacity-80 bg-gray-600'></div>
      }
      {isEditting &&
        <div className='absolute top-12 left-1/4 w-1/2 opacity-100 p-5 z-50 bg-gray-50'>
          <form onSubmit={handleEditPost} className='relative'>
            <Close className='absolute top-0 right-0 cursor-pointer' onClick={()=> setIsEditing(false)}></Close>
            <h1 className="mb-8 text-3xl text-center font-bold">Update Post</h1>

            <div className="mb-3">
              <FormField type="text" name="title" placeholder="Title" action={handleTitleChange} />
            </div>

            <div className="mb-3">
              <div className='flex flex-row text-sm mb-3'>
                <div className='flex items-center mr-5'>
                  <input className='mr-2'
                    type="radio" id='text' name="contentType" value="text/plain" checked={contentType === 'text/plain'} onChange={handleContentTypeChange}
                  />
                  <label htmlFor="text">Text/Plain</label>
                </div>
                <div className='flex items-center'>
                  <input className='mr-2'
                    type="radio" id='markdown' name="contentType" value="text/markdown" checked={contentType === 'text/markdown'} onChange={handleContentTypeChange}
                  />
                  <label htmlFor="markdown">MarkDown</label>
                </div>
              </div>
              <textarea
                className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                name="body"
                id="body"
                onChange={handleContentChange}
                placeholder="Add a content here"
              ></textarea>
              <div>
                <input type='file' onChange={handleImageChange} />
                <img className='max-w-xs max-h-64' src={imageUrl ? imageUrl : ''} />
              </div>
            </div>
            <div className="w-full text-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Update
              </button>
            </div>
          </form>
        </div>}
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

              {post.visibility === "PUBLIC" &&
                <div className='flex flex-row items-center mt-2 cursor-pointer pr-4 text-xs text-gray-700'>
                  <div className='flex flex-row items-center mr-3'
                    onClick={() => handleDeletePost(getUserIdFromUrl(post.author.id), getPostIdFromUrl(post.id))}>
                    <DeleteOutline fontSize='small' />
                    <p>DELETE</p>
                  </div>
                  <div className='flex flex-row items-center' onClick={() => toggleEditWindow(post)}>
                    <Edit fontSize='small' />
                    <p>Edit</p>
                  </div>
                </div>}
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
