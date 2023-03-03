import React, { Component } from 'react'
import Nav from '../components/CommonNav'
import { useRouter } from 'next/router'
import PostsList from './posts';
export default function home() {
  const router = useRouter();
  return (
    <div className='flex flex-row'>
      <Nav></Nav>
      {/* <div className='ml-5 mt-5'>
        {router.pathname === "/posts" ? (
          <PostsList posts={posts} />
        ) : <p>1</p>}
      </div> */}
    </div>
  )
}
