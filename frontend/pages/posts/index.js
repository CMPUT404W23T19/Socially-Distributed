import Link from 'next/link'
import React from 'react'
import Nav from '../../components/CommonNav'
function Post({ id, title, content }) {
  return (
    <div className='bg-gray-100 my-4 ml-2 py-3 px-5'>
      <h2>{title}</h2>
      <p>{content}</p>
      <Link href={`/posts/${id}`}>
        <a className='bg-gray-200 py-1 px-3 text-sm'>View Post</a>
      </Link>
    </div>
  )
}

export default function PostsList({ posts }) {
  posts = [
    { id: 1, title: 'Post 1', content: 'This is the content of post 1.' },
    { id: 2, title: 'Post 2', content: 'This is the content of post 2.' },
    { id: 3, title: 'Post 3', content: 'This is the content of post 3.' },
  ]
  return (
    <div className='flex flex-row'>
      <Nav></Nav>
      <div className='ml-5 mt-5'>
        <h1>All Posts - This is a basic page, not much content and style yet</h1>
        <p>click <span className='text-red-400'>View Post</span> to view the detail of a post</p>
        <div>
          {posts.map(post => (
            <Post key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  )
}

