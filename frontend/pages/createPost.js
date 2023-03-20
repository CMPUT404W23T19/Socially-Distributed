import React, { Component, useCallback, useEffect, useState } from 'react'
import FormField from '../components/common/FormField.js'
import TopNavigation from './TopNavigation.js'
import { reqCreatePost } from '../api/Api.js'
import { getCookieUserId } from '../components/utils/cookieStorage.js';
import { useRouter } from 'next/router.js';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setUserId(getCookieUserId)
  })
  // an get url and host from api: get, http://localhost:8000/authors/{author_id}/
  const handleTitleChange = useCallback((event) => {
    setTitle(event.target.value)
  }, [])

  const handleContentChange = useCallback((event) => {
    setContent(event.target.value)
  }, [])

  const handleVisibilityChange = useCallback(event => {
    setVisibility(event.target.value.toUpperCase())
  })
  async function createPost(e) {
    e.preventDefault();

    if (!title) {
      setError('Please enter a title')
      return
    }

    if (!content) {
      setError('Please write some contents')
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

    const published = new Date().toISOString();
    const data = {
      title,
      source: "http://google.com",
      origin: "http://google.com",
      description: "",
      contentType: " text/markdown",  // only text now, should handle image next
      content,
      author: {
        id: userId,
        // host:"",
        // url:"",
      },
      categories: 'categories',
      published,
      visibility,
      unlisted: true
    }
    try {
      const res = await reqCreatePost(data, userId)
      if (res.status === 201) {
        router.replace('/Feed');
      }
        // console.log(res);
    } catch(error) {
      console.log(error);
    }
  }
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <TopNavigation />
      <div className="container max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center px-2 py-4 mt-20">
        <div className="bg-white px-6 py-8 rounded-xl shadow-md text-black w-full max-w-xl">
          <form onSubmit={createPost}>
            <h1 className="mb-8 text-3xl text-center font-bold">Create Post</h1>

            <div className="mb-6">
              <FormField type="text" name="title" placeholder="Title" action={handleTitleChange} />
            </div>

            <div className="mb-6">
              <label htmlFor="body" className="block mb-2 font-bold text-lg text-gray-800">
                Body
              </label>
              <textarea
                className="w-full h-64 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                name="body"
                id="body"
                onChange={handleContentChange}
                placeholder="Write content here"
                required
              ></textarea>
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
                  <option value="private">Friends</option>
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
            </div>

            <div className="mb-6">
              <label htmlFor="image" className="block mb-2 font-bold text-lg text-gray-800">
                Image
              </label>
              <input type="file" name="image" id="image" className="border rounded-lg p-2" />
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

