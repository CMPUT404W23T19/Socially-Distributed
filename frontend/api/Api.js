import axios from "axios";
import { getJWTToken } from "../components/utils/cookieStorage";

const host = 'https://floating-fjord-51978.herokuapp.com'

export const reqSignUp = (data) => {
  return axios({
    url: `${host}/auth/users/`,
    method: 'post',
    data
  })
}

export const reqLogin = (data) => {
  return axios({
    url: `${host}/auth/jwt/create/`,
    method: 'post',
    data
  })
}

export const reqUserId = () => {
  return axios({
    url: `${host}/auth/users/me`,
    method: 'get',
    headers: {
      Authorization: `Token ${getJWTToken()}`,
    }
  })
}

export const reqUserProfile = (userId) => {
  return axios({
    url: `${host}/authors/${userId}`,
    method: 'get',
    auth:{
      username:'admin',
      password:'admin'
    }
  })
}

export const reqEditUserProfile = (userId, data) => {
  return axios({
    url: `${host}/authors/${userId}/`,
    method: 'post',
    data,
    headers: {
      Authorization: `Bearer ${getJWTToken()}`,
    }
  })
}

export const reqCreatePost = (data, userId) => {
  return axios({
    url: `${host}/authors/${userId}/posts/`,
    method: 'post',
    data,
    headers: {
      Authorization: `Bearer ${getJWTToken()}`,
    }
  })
}

export const reqGetUserPosts = (userId) => {
  return axios({
    url: `${host}/authors/${userId}/posts/`,
    method: 'get',
    auth:{
      username:'admin',
      password:'admin'
    },
  })
}

export const reqGetAuthorsList = () => {
  return axios({
    url: `${host}/authors/`,
    method: 'get',
    auth:{
      username:'admin',
      password:'admin'
    },
  })
}

export const reqDeletePost = (authorId, postId) => {
  return axios({
    url: `${host}/authors/${authorId}/posts/${postId}`,
    method: 'delete',
    headers: {
      Authorization: `Bearer ${getJWTToken()}`,
    }
  })
}

export const reqModifyPost = (authorId, postId) => {
  return axios({
    url: `${host}/authors/${authorId}/posts/${postId}`,
    method: 'put',
    headers: {
      Authorization: `Bearer ${getJWTToken()}`,
    }
  })
}

export const reqGetFollowersList = (authorId) => {
  return axios({
    url: `${host}/authors/${authorId}/followers`,
    method: 'get',
    auth:{
      username:'admin',
      password:'admin'
    }
  })
}

export const reqGetSingleFollower = (authorId, friendId) => {
  return axios({
    url: `${host}/authors/${authorId}/followers/${friendId}`,
    method: 'get'
  })
}

export const reqFollowOthers = (data, authorId, friendId) => {
  return axios({
    url: `${host}/authors/${authorId}/followers/${friendId}`,
    method: 'put',
    data,
    headers: {
      Authorization: `Bearer ${getJWTToken()}`,
    }
  })
}

export const reqUnfollow = (authorId, friendId) => {
  return axios({
    url: `${host}/authors/${authorId}/followers/${friendId}`,
    method: 'delete',
    headers: {
      Authorization: `Bearer ${getJWTToken()}`,
    }
  })
}

export const reqPostToInbox = (data, authorId) => {
  return axios({
    url: `${host}/authors/${authorId}/inbox`,
    method: "post",
    data,
    headers: {
      Authorization: `Bearer ${getJWTToken()}`,
    }
  })
}

export const reqGetInbox = (authorId) => {
  return axios({
    url: `${host}/authors/${authorId}/inbox`,
    method: "get",
    // auth:{
    //   username:'admin',
    //   password:'admin'
    // },
    headers: {
      Authorization: `Bearer ${getJWTToken()}`,
    }
  
  })
}

export const reqClearInbox = (authorId) => {
  return axios({
    url: `${host}/authors/${authorId}/inbox`,
    method: 'delete',
    headers: {
      Authorization: `Bearer ${getJWTToken()}`,
    }
  })
}

export const reqPostComments = (data, authorId, postId) => {
  return axios({
    url: `${host}/authors/${authorId}/posts/${postId}/comments`,
    method: 'post',
    data
  })
}

export const reqGetComments = (authorId, postId) => {
  return axios({
    url:`${host}/authors/${authorId}/posts/${postId}/comments`,
    method:'get',
    auth:{
      username:'admin',
      password:'admin'
    }
  })
}