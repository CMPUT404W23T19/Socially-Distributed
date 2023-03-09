import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopNavigation from './TopNavigation';
import { IconButton } from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

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
    return;
    const existingComment = comments.find(comment => comment.postId === postId);
    setCommentText(existingComment ? existingComment.body : "");
    setIsCollapsed(false);
  
    const handleCommentSave = () => {
      if (existingComment) {
        // Update existing comment
        axios.put(`https://jsonplaceholder.typicode.com/comments/${existingComment.id}`, { body: commentText })
          .then(response => {
            const updatedComments = [...comments];
            updatedComments[updatedComments.findIndex(comment => comment.id === existingComment.id)] = response.data;
            setComments(updatedComments);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        // Create new comment
        axios.post('https://jsonplaceholder.typicode.com/comments', { postId, body: commentText })
          .then(response => {
            setComments([...comments, response.data]);
          })
          .catch(error => {
            console.log(error);
          });
      }
      setCommentText("");
      setPosts([
        ...posts.slice(0, postIndex),
        { ...post, comments: existingComment ? post.comments : [...post.comments, comments.length + 1] },
        ...posts.slice(postIndex + 1),
      ]);
    };
  
    const commentEditor = (
      <ReactQuill
        value={commentText}
        onChange={setCommentText}
      />
    );
  
    // Render comment editor and save button
    ReactDOM.render(
      <div>
        {commentEditor}
        <button onClick={handleCommentSave}>Save</button>
      </div>,
      document.getElementById(`comment-editor-${postId}`)
    );
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
            <IconButton onClick={() => handleLike(post.id)}><FavoriteIcon /></IconButton>
              <IconButton onClick={() => handleComment(post.id)}><CommentIcon /></IconButton>
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
