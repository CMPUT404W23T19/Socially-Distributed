import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopNavigation from './TopNavigation';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/comments')
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleLike = (postId) => {
    // handle like logic here
  };

  const handleComment = (postId) => {
    // handle comment logic here
  };

  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleComments = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="container mx-auto pt-10 pl-32">
      <TopNavigation />
      <h1 className="text-3xl font-bold mt-10 mb-5" style={{ marginLeft: "20px" }}>See What Your Friends Are Up to!</h1>
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-lg shadow-lg p-5 my-5">
          <div className="flex items-center mb-3">
            <img src={`https://i.pravatar.cc/50?u=${post.userId}`} alt="" className="w-8 h-8 rounded-full mr-2" />
            <h2 className="text-lg font-bold">{`User ${post.userId}`}</h2>
          </div>
          <p className="text-base mb-3">{post.body}</p>
          <div className="flex justify-between">
            <div className="flex">
              <button className="bg-gray-200 rounded-lg px-4 py-2 mr-3 hover:bg-gray-300" onClick={() => handleLike(post.id)}>Like</button>
              <button className="bg-gray-200 rounded-lg px-4 py-2 hover:bg-gray-300" onClick={() => handleComment(post.id)}>Comment</button>
            </div>
            <button className="bg-gray-200 rounded-lg px-4 py-2" onClick={toggleComments}>{isCollapsed ? "Show Comments" : "Hide Comments"}</button>
          </div>
          {comments.filter(comment => comment.postId === post.id && !isCollapsed).length > 0 && (
            <div className="mt-5">
              <h3 className="text-lg font-bold mb-3">Comments</h3>
              {comments.filter(comment => comment.postId === post.id).map(comment => (
                <div key={comment.id} className="bg-gray-200 rounded-lg p-3 my-3">
                  <div className="flex items-center mb-2">
                    <img src={`https://i.pravatar.cc/50?u=${comment.email}`} alt="" className="w-8 h-8 rounded-full mr-2" />
                    <h4 className="text-base font-bold">{comment.name}</h4>
                  </div>
                  <p className="text-base">{comment.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Feed;
