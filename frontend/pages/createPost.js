import React, { Component, useCallback, useEffect, useState } from 'react'
import FormField from '../components/common/FormField.js'
import TopNavigation from './TopNavigation.js'
import { reqCreatePost, reqGetAuthorsList, reqGetFollowersList, reqPostToInbox, reqUserProfile } from '../api/Api.js'
import { getCookieUserId } from '../components/utils/cookieStorage.js';
import { useRouter } from 'next/router.js';
import { getJWTToken } from '../components/utils/cookieStorage.js';
import axios from 'axios';
import { Close } from '@material-ui/icons';
export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('');
  const [visibility, setVisibility] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);
  const [followers, setFollowers] = useState([])
  const [user, setUser] = useState(null)
  const [isPrvate, setIsPrivate] = useState(false)
  const [privateAuthor, setPrivateAuthor] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageType, setImageType] = useState('')
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const router = useRouter();

  useEffect(() => {
    setUserId(getCookieUserId())
    if (userId) {
      reqGetFollowersList(userId)
        .then(res => setFollowers(res.data.items), err => console.log(err))
      reqUserProfile(userId)
        .then(res => setUser(res.data), err => console.log(err))
    }
  }, [userId])
  // an get url and host from api: get, http://localhost:8000/authors/{author_id}/
  const handleTitleChange = useCallback((event) => {
    setTitle(event.target.value)
  }, [])

  const handleContentChange = useCallback((event) => {
    setContent(event.target.value)
  }, [])

  const handleVisibilityChange = useCallback(event => {
    const v = event.target.value.toUpperCase()
    setVisibility(v)
    if (v === "PRIVATE") {
      setIsPrivate(true)
    } else {
      setIsPrivate(false)
    }
  })

  const handlePriavteMsg = useCallback(event => {
    setPrivateAuthor(event.target.value)
  })

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

  const sendToInbox = (authors, postData) => {
    const promises = authors.map(author => {
      if (author.host === "https://floating-fjord-51978.herokuapp.com") {
        return axios({
          url: `${author.url}/inbox`,
          method: "post",
          data: postData,
          auth: {
            username: 'admin',
            password: 'admin'
          }
        })
      } else if (author.host === "https://distributed-social-net.herokuapp.com") {
        return axios({
          url: `${author.url}/inbox/`,
          method: "post",
          data: postData,
          auth: {
            username: "cmput404_team18",
            password: "cmput404_team18"
          }
        })
      } else if (author.host === "cmput404-group-project.herokuapp.com") {
        return axios({
          url: `${author.url}inbox/`,
          method: "post",
          data: postData,
          auth: {
            username: "remote",
            password: "remote"
          }
        })
      }

    })
    Promise.all(promises)
      .then(res => {
        console.log("successful post to inbox", res);
        router.replace('/post/me');
      }, err => console.log("failed post to inbox", err))
  }

  async function createPost(e) {
    e.preventDefault();

    if (!title) {
      setError('Please enter a title')
      return
    }

    if (!content && !imageUrl) {
      setError('Please write some contents or post an image')
      return
    }

    if (!visibility) {
      setError('Please choose visibility')
      return
    }

    if (title.length > 100) {
      setError('Title: too much words!')
      return
    }
    if (!contentType) {
      setContentType("text/plain")
    }

    const published = new Date().toISOString();
    let data = {
      title,
      source: user.url,
      origin: user.url,
      description: "",
      contentType,
      content,
      author: user,
      categories,
      published,
      visibility,
      unlisted: false
    }
    console.log(categories);
    if (content && imageUrl) {
      // content += `!["post image"](${imageUrl})`
      data.content = data.content + `!["post image"](${imageUrl})`
      data.contentType = "text/markdown"
      create(data)
    } else if (content) {
      create(data)
    } else if (imageUrl) {
      data.contentType = imageType
      data.content = imageUrl
      create(data)
    }

  }

  const create = async (data) => {
    try {
      const res = await reqCreatePost(data, userId)
      if (res.status === 201) {
        const postData = {
          "type": "post",
          ...res.data
        }
        console.log('====================================');
        console.log("postdata", postData);
        console.log('====================================');
        if (visibility === 'FRIEND') {
          sendToInbox(followers, postData)
        } else if (visibility === 'PUBLIC') {
          const res = await reqGetAuthorsList()
          const localAuthors = res.data.items.filter(author => author.host === "https://floating-fjord-51978.herokuapp.com" && author.id !== user.id)
          sendToInbox(localAuthors, postData)
        } else if (visibility === 'PRIVATE') {
          // Todo: determine the host of author's url, use the corresponding auth
          let author = []
          const res = await axios({
            url: `${privateAuthor}`,
            method: 'get',
            auth: {
              username: 'admin',
              password: 'admin'
            }
          })
          if (res.status >= 200 && res.status < 300) {
            author.push(res.data)
            sendToInbox(author, postData)
          } else {
            confirm("User does not exsits!")
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addCategory = useCallback(event => {
    let categoryList = categories
    categoryList.push(event.target.value)
    setCategories(categoryList)
    setCategory('')

  })

  const removeCategory = (category) => {
    console.log(category);
    let categoryList = categories
    categoryList = categoryList.filter(cate => cate != category)
    console.log(categoryList);
    setCategories(categoryList)
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <TopNavigation />
      <div className="container max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center px-2 py-4 mt-20">
        <div className="bg-white px-6 py-8 rounded-xl shadow-md text-black w-full max-w-xl">
          <form onSubmit={createPost}>
            <h1 className="mb-8 text-3xl text-center font-bold">Create Post</h1>

            <div className="mb-6">
              <p className="block mb-2 font-bold text-lg text-gray-800">
                Title
              </p>
              <FormField type="text" name="title" placeholder="Title" action={handleTitleChange} />
            </div>

            <div className="mb-6">
              <label htmlFor="body" className="block mb-2 font-bold text-lg text-gray-800">
                Body
              </label>
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
                className="w-full h-64 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                name="body"
                id="body"
                onChange={handleContentChange}
                placeholder="Write content here"
              ></textarea>
              <div>
                <p className="block mb-2 font-bold text-lg text-gray-800">Image</p>
                <input type='file' onChange={handleImageChange} />
                <img className='max-w-xs max-h-64' src={imageUrl ? imageUrl : ''} />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="visibility" className="block mb-2 font-bold text-lg text-gray-800">
                Visibility
              </label>
              <div className="inline-block relative w-full">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="visibility"
                  name="visibility"
                  onChange={handleVisibilityChange}
                >
                  <option value="">--Choose an option--</option>
                  <option value="public">Public</option>
                  <option value="friend">Friends</option>
                  <option value="private">Private</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M14.71 7.29a1 1 0 0 0-1.42 0L10 10.59l-3.29-3.3a1 1 0 1 0-1.42 1.42l4 4a1 1 0 0 0 1.42 0l4-4a1 1 0 0 0 0-1.42z"
                    />
                  </svg>
                </div>
              </div>
              {isPrvate &&
                <div>
                  <input onChange={handlePriavteMsg} placeholder="Please enter the author's id you'd message to" className='w-full outline-none mt-5 py-2 px-2 border rounded-md border-gray-200' />
                </div>}
            </div>

            <div className='mb-6'>
              <p className="block mb-2 font-bold text-lg text-gray-800">Categories</p>
              <input className='py-1 px-2' type='text' placeholder='category' value={category} onChange={(e) => setCategory(e.target.value)} onBlur={addCategory} />
              <div className='mt-4'>
                {categories.length > 0 && categories.map(category => (
                  <span key={category} className='rounded-lg bg-gray-50 px-2 mr-3 '>
                    {category}
                    <Close fontSize='medium' className='pl-3 cursor-pointer' onClick={() => removeCategory(category)}></Close>
                  </span>
                ))}
              </div>
            </div>
            <div className="w-full text-center">
              {error && <div className='text-red-600 text-sm mb-3'>{error}</div>}
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

}

