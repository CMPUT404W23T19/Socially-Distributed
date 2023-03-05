import { useRouter } from 'next/router'
import { useState } from 'react'

export default function PostPage() {
  const router = useRouter()
  const { id } = router.query
  const [commentValue, setCommentValue] = useState('');

  const goBack = () => {
    router.back();
  }

  const likePost = () => {

  }

  const getCommentValue = (e) => {
    setCommentValue(e.target.value);
  }
  const makeComments = () => {
    console.log(commentValue);
  }

  return (
    <div className='w-full h-screen'>
      <button onClick={goBack} className="px-3 py-1 mt-8 ml-10 bg-gray-100 text-sm">← Back</button>
      <div className='w-1/2 mt-10 mx-auto border-gray-300 border-1 p-5 shadow-md'>
        <h1>Post {id}</h1>
        <div className='p-3 bg-blue-50 mt-3'>
          <p>This is the detailed page for post {id}.</p>
          {/* <img></img> */}
        </div>
        <div className='text-right mt-1 mb-3'>
          {/* may change to a like icon */}
          <button onClick={likePost} className="text-blue-800 px-3 py-1 mr-3 text-sm">like</button>
          {/* <button className=' text-blue-700 text-xs'>delete</button> */}
        </div>
        <div>
          <div>
            <textarea value={commentValue} onChange={getCommentValue} className="border-2 w-full h-24" style={{ resize: 'none' }} placeholder='write down your thoughts...'></textarea>
          </div>
          <button onClick={makeComments} className="px-4 py-1 bg-gray-200 shadow-lg w-1/5 mt-1 mb-4 hover:bg-gray-300 text-sm">send</button>
        </div>
        <ul className='text-xs bg-gray-100 mt-6'>
          {/* comments.map() */}
          <li className='border-b-2 py-1 px-3'>comment 1</li>
          <li className='border-b-2 py-1 px-3'>comment 2</li>
          <li className='border-b-2 py-1 px-3'>comment 3</li>
        </ul>
      </div>
    </div>
  )
}

